import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@nishilfaldu/sunny", "@nishilfaldu/site-agent"],
  // Native Node package — keep it out of the bundler.
  serverExternalPackages: ["@cursor/sdk"],
  async redirects() {
    return [
      // /people was live and indexed for a day before it grew an archive and
      // became /reading. Permanent: the old URL is not coming back.
      { source: "/people", destination: "/reading", permanent: true },
    ];
  },
};

export default nextConfig;
