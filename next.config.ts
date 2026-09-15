import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // experimental: {
  //   staleTimes: {
  //     dynamic: 0,
  //     static: 1800, // 30 minutes (prevent client cache eviction from closing modal)
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dogapi.dog",
      },
    ],
  },
};

export default nextConfig;
