const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL || '';
const backendUrl = rawBackendUrl && !rawBackendUrl.includes('vercel.app')
  ? rawBackendUrl
  : 'https://clickmarido.onrender.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

