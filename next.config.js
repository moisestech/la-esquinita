/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dck5rzi4h/image/upload/**',
      }
    ]
  }
}

module.exports = nextConfig 