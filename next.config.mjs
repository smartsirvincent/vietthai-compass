/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
    formats: ["image/webp"],
    minimumCacheTTL: 3600
  }
};

export default nextConfig;
