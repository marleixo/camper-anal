import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.5.25'],
	experimental: { serverActions: { bodySizeLimit: '10mb' } },
};
export default nextConfig;