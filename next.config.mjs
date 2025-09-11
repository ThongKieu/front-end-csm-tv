/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.1.46', 'csm.thoviet.net'],
  },
  async headers() {
    return [
      {
        // Cho phép tất cả các routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          // Thêm headers để tối ưu hóa performance
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      // Tối ưu hóa cho API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Accept, Authorization',
          },
          // Cache API responses
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ]
  },
  // Tối ưu hóa experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    },
    // Tối ưu hóa bundle
    optimizePackageImports: ['lucide-react'],
  },
  // Tối ưu hóa rewrites để giảm latency
  async rewrites() {
    return [
      {
        source: '/api/web/:path*',
        destination: 'http://192.168.1.46/api/web/:path*',
      },
    ]
  },
  // Tối ưu hóa webpack
  webpack: (config, { dev, isServer }) => {
    // Tối ưu hóa cho production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  // Tối ưu hóa performance
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Tắt Next.js development indicator
  devIndicators: {
    buildActivity: false,
    position: 'bottom-right',
  },
};

export default nextConfig;
