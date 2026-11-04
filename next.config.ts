import type { NextConfig } from "next";

// Static export: the build is plain HTML/CSS/JS in out/, no server, no database.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // images are pre-sized WebP in public/
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
