/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
  },
  assetPrefix: '',
  basePath: '',
}

module.exports = nextConfig