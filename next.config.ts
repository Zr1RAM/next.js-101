import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // [ROUTER CACHE (Client-side In-Memory Cache)]:
  // Configures how long visited route segments remain cached in the user's browser memory
  // experimental: {
  //   staleTimes: {
  //     dynamic: 0,
  //     static: 1800, // 30 minutes (prevents client Router Cache eviction from closing modal)
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
