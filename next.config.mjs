/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/en',
  async redirects() {
    return [
      {
        source: '/tour/:id',
        destination: '/activity/product/:id',
        permanent: true,
      },
      {
        source: '/',
        destination: '/en',
        permanent: false,
        basePath: false,
      },
    ]
  },
}

export default nextConfig


