import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/demos/*': ['./concepts/**/*'],
  },
};

export default nextConfig;
