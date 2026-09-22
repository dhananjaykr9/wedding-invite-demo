import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: '.',
    },
  },
};

export default nextConfig;