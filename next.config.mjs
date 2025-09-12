/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/en',
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  async redirects() {
    return [
      {
        // Canonical detail route is /tour/:id. Ensure old path redirects here.
        source: '/activity/product/:id',
        destination: '/tour/:id',
        permanent: true,
      },
      {
        source: '/',
        destination: '/en',
        permanent: false,
        basePath: false,
      },
      {
        // Handle direct /hotel hits without basePath and send to /en/products
        // This catches https://<domain>/hotel (no /en prefix)
        source: '/hotel',
        destination: '/en/products',
        permanent: false,
        basePath: false,
      },
    ]
  },
}

export default nextConfig


