/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignora erros de tipagem no build
  },
  eslint: {
    ignoreDuringBuilds: true, // Opcional: ignora erros de lint, se houver
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.ifood-static.com.br',
        pathname: '/image/upload/**',
      },
    ],
  },
}

export default nextConfig
