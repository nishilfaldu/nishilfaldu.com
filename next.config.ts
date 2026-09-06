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
      // Showcase pages that left /projects; keep old URLs from 404ing.
      { source: "/projects/agent", destination: "/projects", permanent: true },
      {
        source: "/projects/phone-tap",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/sediment",
        destination: "/projects",
        permanent: true,
      },
      { source: "/projects/atlas", destination: "/projects", permanent: true },
      {
        source: "/projects/cooking",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
