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
};

module.exports = nextConfig;
