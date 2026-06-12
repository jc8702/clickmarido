const isProd = process.env.NODE_ENV === 'production';
const backendUrl = isProd 
  ? 'https://clickmarido.onrender.com' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

