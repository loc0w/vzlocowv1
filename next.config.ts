import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ['images-na.ssl-images-amazon.com'],
  },
  env: {
    KEEPA_API_KEY: process.env.KEEPA_API_KEY,
  },
}

export default nextConfig;
