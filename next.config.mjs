/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return ["www.vietthaiguide.com", "vietthai-compass.vercel.app", "vietthai-compass-smartsirvincents-projects.vercel.app"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://vietthaiguide.com/:path*",
      permanent: true
    }));
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
    formats: ["image/webp"],
    minimumCacheTTL: 3600
  }
};

export default nextConfig;
