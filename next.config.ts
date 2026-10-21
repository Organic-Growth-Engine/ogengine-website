import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.77"],
  async rewrites() {
    return {
      // Serve the launch page without removing the existing application routes.
      beforeFiles: [{ source: "/", destination: "/launch/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
