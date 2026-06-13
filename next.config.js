/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  sassOptions: {
    includePath: './src/styles/',
  },
};

export default nextConfig;
