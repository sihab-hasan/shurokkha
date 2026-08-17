import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: "/docs",

  transpilePackages: ["@shurokkha/ui", "@shurokkha/ui-patterns"],
}

export default nextConfig
