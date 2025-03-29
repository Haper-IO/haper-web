import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: process.env.NODE_ENV == "development" ? ["preview.haper.io"] : undefined,
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV == "development" ? ['preview.haper.io'] : undefined
    },
  },
  output: process.env.HOSTING_METHOD === "docker" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      }
    ]
  },

};

export default nextConfig;
