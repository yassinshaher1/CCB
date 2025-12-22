/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Proxy API requests to backend services inside K8s cluster
  async rewrites() {
    return [
      // User profile service (auth, profile endpoints)
      {
        source: '/api/auth/:path*',
        destination: 'http://user-profile-service/auth/:path*',
      },
      {
        source: '/api/profile/:path*',
        destination: 'http://user-profile-service/profile/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://user-profile-service/users/:path*',
      },
      // Catalog service
      {
        source: '/api/products/:path*',
        destination: 'http://catalog-service/products/:path*',
      },
      {
        source: '/api/products',
        destination: 'http://catalog-service/products',
      },
      // Order service
      {
        source: '/api/order/:path*',
        destination: 'http://order-service/order/:path*',
      },
      {
        source: '/api/order',
        destination: 'http://order-service/order',
      },
      // Fetch orders routes
      {
        source: '/api/orders/:email',
        destination: 'http://order-service/orders/:email',
      },
      {
        source: '/api/orders',
        destination: 'http://order-service/orders',
      },
    ];
  },
}

export default nextConfig
