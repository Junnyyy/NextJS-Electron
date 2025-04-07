import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "out",
  // Only use assetPrefix in production, not in development
  assetPrefix: process.env.NODE_ENV === "production" ? "./" : "",
  // Treat each page as standalone and use query params instead of dynamic routes when needed
  trailingSlash: true,
};

export default nextConfig;
