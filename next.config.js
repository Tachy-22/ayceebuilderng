/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "media.istockphoto.com",
      "5.imimg.com",
      "www.julius-berger.com",
      "res.cloudinary.com", // Added Cloudinary domain
      "cdns.sipmm.edu.sg"
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
