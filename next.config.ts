/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["q2qwccah9hqmefmy.public.blob.vercel-storage.com"],
  },
};

module.exports = nextConfig;