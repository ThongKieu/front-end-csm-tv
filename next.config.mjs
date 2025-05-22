/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.1.59'],
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
        ],
      },
    ]
  },
  // Tắt caching cho các route động
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.59:3000/api/:path*',
      },
    ]
  },
};

export default nextConfig;
