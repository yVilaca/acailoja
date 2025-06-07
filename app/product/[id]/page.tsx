'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { NextPage } from 'next';
import { ChevronLeft, Star, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCart } from '@/context/cart-context';

// Produto de exemplo
const product = {
  id: 1,
  name: 'Açaí Tradicional 500ml',
  description: 'Açaí puro e cremoso com granola e banana',
  longDescription:
    'Nosso açaí tradicional é preparado com as melhores frutas da Amazônia, batido na hora para garantir a cremosidade perfeita. Acompanha granola crocante e banana fresca fatiada. Uma explosão de sabor e energia para o seu dia!',
  price: 18.9,
  salePrice: 15.9,
  rating: 4.8,
  reviews: 127,
  images: [
    '/placeholder.svg?height=400&width=400',
    '/placeholder.svg?height=400&width=400',
    '/placeholder.svg?height=400&width=400',
  ],
  ingredients: 'Polpa de açaí, xarope de guaraná, granola, banana.',
  nutritionalInfo: 'Porção de 100g: Calorias: 58kcal, Carboidratos: 6g, Proteínas: 0.8g, Gorduras: 3.8g, Fibras: 2g',
  additionalInfo:
    'Produto 100% natural, sem conservantes. Contém glúten na granola. Alérgicos: pode conter traços de castanhas.',
};

const ProductPage: NextPage<{ params: { id: string } }> = ({ params }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);
  const addToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0],
      },
      quantity,
    );
  };
  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold">Detalhes do Produto</h1>
          <Button variant="ghost" size="icon" onClick={toggleFavorite} className={isFavorite ? 'text-red-500' : ''}>
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500' : ''}`} />
          </Button>
        </div>
      </header>
      <div className="flex-1">
        <div className="relative bg-white">
          <div className="relative h-80 w-full">
            <Image
              src={product.images[activeImage] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-contain"
            />
            {discount > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                -{discount}%
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-2 p-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-16 w-16 overflow-hidden rounded-md border-2 ${
                  activeImage === index ? 'border-purple-500' : 'border-transparent'
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${product.name} - imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="mb-2 mt-1 flex items-center">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="mr-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews} avaliações)</span>
          </div>
          <div className="mb-4 flex items-center">
            {product.salePrice < product.price ? (
              <>
                <span className="mr-2 text-sm text-gray-500 line-through">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-2xl font-bold text-purple-700">
                  R$ {product.salePrice.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-purple-700">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <p className="mb-4 text-gray-600">{product.description}</p>
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none text-gray-600"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none text-gray-600"
                onClick={increaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="flex-1 bg-purple-600 py-6 text-lg font-bold hover:bg-purple-700" onClick={addToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Adicionar à Sacola
            </Button>
          </div>
          <Separator className="my-6" />
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1">Ingredientes</TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">Nutrição</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-gray-600">
              <p>{product.longDescription}</p>
              <p className="mt-4">{product.additionalInfo}</p>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-4 text-gray-600">
              <p>{product.ingredients}</p>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-4 text-gray-600">
              <p>{product.nutritionalInfo}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;