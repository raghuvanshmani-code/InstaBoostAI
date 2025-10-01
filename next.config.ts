import type {NextConfig} from 'next';

export default nextConfig;
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',               // For static export
  basePath: '/InstaBoostAI',
  devIndicators: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1759314959280.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
