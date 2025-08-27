/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
  },
}

module.exports = nextConfig