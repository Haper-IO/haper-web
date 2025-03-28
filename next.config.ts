import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
