'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Phone, Home, Edit, QrCode, Search, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useViaCep } from '@/hooks/use-viacep';
import { ShippingCalculator } from '@/components/shipping-calculator';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { subtotal, clearCart } = useCart();
  const { fetchAddress, loading: cepLoading, error: cepError } = useViaCep();

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    phone: '',
  });

  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDistance, setShippingDistance] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressFilled, setAddressFilled] = useState(false);
  const [lastCep, setLastCep] = useState('');
  const [pixData, setPixData] = useState<{
    pixCode: string;
    qrCodeUrl: string;
    transactionId: string;
    amount: string;
    product: string;
    customer: { name: string; email: string; phone: string; cpf: string };
    transactionToken: string;
  } | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null);

  const total = subtotal + shippingCost;

  // Carregar localização do localStorage apenas no cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setUserLocation({ city: parsed.city, state: parsed.state });
        } catch (error) {
          console.error('Erro ao carregar localização:', error);
        }
      }
    }
  }, []);

  // Temporizador para o PIX
  useEffect(() => {
    if (showPixModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showPixModal, timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .slice(0, 15);
    } else if (name === 'zipCode') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(?=\d)/g, '$1-')
        .slice(0, 9);
    } else if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (name === 'zipCode' && formattedValue !== lastCep) {
      setShippingCost(0);
      setShippingDistance('');
      setEstimatedTime('');
    }
  };

  const handleCepSearch = async () => {
    if (!formData.zipCode) return;
    const addressData = await fetchAddress(formData.zipCode);
    if (addressData) {
      setFormData((prev) => ({
        ...prev,
        street: addressData.street,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
      }));
      setAddressFilled(true);
      setLastCep(formData.zipCode);
      toast({
        title: 'Endereço encontrado!',
        description: 'Dados preenchidos automaticamente. Informe apenas o número.',
      });
    }
  };

  useEffect(() => {
    const cleanCep = formData.zipCode.replace(/\D/g, '');
    if (cleanCep.length === 8 && cleanCep !== lastCep.replace(/\D/g, '')) {
      handleCepSearch();
    }
  }, [formData.zipCode]);

  const resetLocation = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userLocation');
      localStorage.removeItem('showProducts');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('shipping-')) {
          localStorage.removeItem(key);
        }
      });
    }
    router.push('/');
  };

  const handleShippingCalculated = (cost: number, distance: string, time: string) => {
    setShippingCost(cost);
    setShippingDistance(distance);
    setEstimatedTime(time);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!formData.zipCode.trim() || formData.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP inválido';
    }
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }
    if (shippingCost === 0) newErrors.shipping = 'Calcule o frete antes de finalizar';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost/api/generate-pix.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          cpf: formData.cpf.replace(/\D/g, ''),
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          product: 'Rei do Açai Delivery',
          amount: (total * 100).toString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar PIX');
      }
      setPixData(data);
      setShowPixModal(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'deliveryAddress',
          JSON.stringify({
            zipCode: formData.zipCode,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            phone: formData.phone,
            shippingCost,
            shippingDistance,
            estimatedTime,
            pixData: data,
          })
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao processar pagamento PIX',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixCode = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.pixCode);
    toast({
      title: 'Código copiado!',
      description: 'O código PIX foi copiado para a área de transferência.',
    });
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Link href="/cart" className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Finalizar Compra</h1>
        </div>
      </header>

      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center font-bold">
              <MapPin className="mr-2 h-5 w-5 text-purple-600" />
              Dados do Cliente
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  className={errors.name ? 'border-red-500' : ''}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-red-500' : ''}
                  value={formData.cpf}
                  onChange={handleChange}
                />
                {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone para contato *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center font-bold">
              <MapPin className="mr-2 h-5 w-5 text-purple-600" />
              Endereço de Entrega
            </h2>
            <div className="space-y-4">
              {userLocation && (
                <div className="rounded-lg bg-purple-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Região de entrega</p>
                      <p className="text-sm text-purple-600">
                        {userLocation.city}, {userLocation.state}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={resetLocation}
                      className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Alterar
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="00000-000"
                      className={errors.zipCode ? 'border-red-500' : ''}
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCepSearch}
                    disabled={cepLoading || formData.zipCode.replace(/\D/g, '').length !== 8}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                {cepError && <p className="text-xs text-red-500">{cepError}</p>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Rua *</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="street"
                      name="street"
                      placeholder="Nome da rua"
                      className={`pl-10 ${errors.street ? 'border-red-500' : ''} ${addressFilled ? 'bg-gray-50' : ''}`}
                      value={formData.street}
                      onChange={handleChange}
                      readOnly={addressFilled}
                    />
                  </div>
                  {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    name="number"
                    placeholder="123"
                    className={errors.number ? 'border-red-500' : ''}
                    value={formData.number}
                    onChange={handleChange}
                  />
                  {errors.number && <p className="text-xs text-red-500">{errors.number}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento (opcional)</Label>
                <Input
                  id="complement"
                  name="complement"
                  placeholder="Apto, bloco, referência"
                  value={formData.complement}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    placeholder="Seu bairro"
                    className={`${errors.neighborhood ? 'border-red-500' : ''} ${addressFilled ? 'bg-gray-50' : ''}`}
                    value={formData.neighborhood}
                    onChange={handleChange}
                    readOnly={addressFilled}
                  />
                  {errors.neighborhood && <p className="text-xs text-red-500">{errors.neighborhood}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Sua cidade"
                    className={`${errors.city ? 'border-red-500' : ''} ${addressFilled ? 'bg-gray-50' : ''}`}
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={addressFilled}
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="UF"
                  className={`${errors.state ? 'border-red-500' : ''} ${addressFilled ? 'bg-gray-50' : ''}`}
                  value={formData.state}
                  onChange={handleChange}
                  readOnly={addressFilled}
                />
                {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
              </div>
            </div>
          </div>

          {addressFilled && formData.number && (
            <ShippingCalculator
              street={formData.street}
              number={formData.number}
              neighborhood={formData.neighborhood}
              city={formData.city}
              state={formData.state}
              zipCode={formData.zipCode}
              onShippingCalculated={handleShippingCalculated}
            />
          )}
          {errors.shipping && <p className="text-xs text-red-500">{errors.shipping}</p>}

          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-bold">Resumo do Pedido</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Frete ({shippingDistance} - {estimatedTime})
                  </span>
                  <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-purple-700">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 py-6 text-lg font-bold hover:bg-purple-700"
            disabled={isProcessing || shippingCost === 0}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processando PIX...
              </span>
            ) : (
              'Finalizar Pagamento via PIX'
            )}
          </Button>

          <div className="flex items-center justify-center text-xs text-gray-500">
            <QrCode className="mr-1 h-3 w-3" />
            Pagamento 100% seguro via PIX
          </div>
        </form>

        {showPixModal && pixData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold">Pagamento via PIX</h2>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold mb-2">R$ {pixData.amount}</p>
                <p className="text-sm text-gray-600 mb-4">{pixData.product}</p>
                <div className="mb-4">
                  <img src={pixData.qrCodeUrl} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg shadow-sm" />
                </div>
                <div className="mb-4">
                  <Label htmlFor="pixCode">Código PIX</Label>
                  <div className="relative">
                    <textarea
                      id="pixCode"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                      rows={4}
                      value={pixData.pixCode}
                    />
                    <Button
                      onClick={copyPixCode}
                      className="mt-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-yellow-100 p-3 rounded-lg mb-4">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium">
                    {timeLeft > 0 ? `${formatTimeLeft()} para pagar` : 'Expirado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPixModal(false);
                      router.push('/order-confirmation');
                    }}
                  >
                    Continuar
                  </Button>
                  <Button
                    onClick={() => setShowPixModal(false)}
                    variant="destructive"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}