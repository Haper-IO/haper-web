import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.HOSTING_METHOD === "docker" ? "standalone": undefined,
};

export default nextConfig;
