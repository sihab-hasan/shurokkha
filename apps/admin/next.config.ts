import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: "/admin",

  transpilePackages: ["@shurokkha/ui", "@shurokkha/ui-patterns"],
}

export default nextConfig
