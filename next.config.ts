import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@nishilfaldu/sunny", "@nishilfaldu/site-agent"],
  // Native Node package — keep it out of the bundler.
  serverExternalPackages: ["@cursor/sdk"],
};

export default nextConfig;
