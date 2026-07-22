import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@nishilfaldu/sunny", "@nishilfaldu/site-agent"],
};

export default nextConfig;
