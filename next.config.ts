import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["source.unsplash.com", "images.unsplash.com"],
  },
};

export default nextConfig;
