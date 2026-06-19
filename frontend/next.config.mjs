import createBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL || '';
const backendUrl = rawBackendUrl && !rawBackendUrl.includes('vercel.app')
  ? rawBackendUrl
  : 'https://clickmarido.onrender.com';

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

const backendHostname = extractHostname(backendUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
        },
      ],
    };
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: backendHostname
      ? [
          {
            protocol: 'https',
            hostname: backendHostname,
          },
        ]
      : [],
  },
};

const sentryConfig = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  hideSourceMaps: true,
  widenClientFileUpload: true,
};

export default withBundleAnalyzer(withSerwist(withSentryConfig(nextConfig, sentryConfig)));
