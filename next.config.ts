import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image in Next 16 only serves qualities from this list.
    qualities: [60, 75, 85],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
