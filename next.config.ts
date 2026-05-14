// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   allowedDevOrigins: ['172.31.239.60'],

// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.31.239.60'],
  env: {
    NEXT_PUBLIC_PWA_CACHE_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.RAILWAY_GIT_COMMIT_SHA ||
      process.env.RENDER_GIT_COMMIT ||
      process.env.npm_package_version ||
      'dev',
  },
};

module.exports = nextConfig;
