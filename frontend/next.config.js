/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://presence-imobiliaria-api.onrender.com/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig