import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: "/admin",

  transpilePackages: [
    "@shurokkha/api-client",
    "@shurokkha/auth",
    "@shurokkha/contracts",
    "@shurokkha/icons",
    "@shurokkha/ui",
  ],
}

export default nextConfig
