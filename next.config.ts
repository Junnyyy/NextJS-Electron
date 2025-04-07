import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir: "out",
  assetPrefix: process.env.NODE_ENV === "production" ? "./" : "",
  trailingSlash: true,
};

export default nextConfig;
