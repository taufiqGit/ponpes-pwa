import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
}

const withPWA = withPWAInit({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  disable: false,
  register: true,
  skipWaiting: true,
});

export default process.env.NODE_ENV === 'development' 
  ? nextConfig 
  : withPWA(nextConfig);
