/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.ifood-static.com.br'],
  },
  async rewrites() {
    return [
      {
        source: '/api/generate-pix',
        destination: 'http://localhost/generate-pix.php',
      },
    ]
  },
}

module.exports = nextConfig
