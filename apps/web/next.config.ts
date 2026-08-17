import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: [
    "@shurokkha/api-client",
    "@shurokkha/icons",
    "@shurokkha/ui",
    "@shurokkha/ui-patterns",
  ],

  async redirects() {
    return [
      { source: "/auth/signin", destination: "/sign-in", permanent: true },
      { source: "/auth/signup", destination: "/sign-up", permanent: true },
      { source: "/auth/signout", destination: "/sign-out", permanent: true },
      {
        source: "/auth/forgot-password",
        destination: "/forgot-password",
        permanent: true,
      },
      {
        source: "/auth/reset-password",
        destination: "/reset-password",
        permanent: true,
      },
      {
        source: "/auth/verify-email",
        destination: "/verify-email",
        permanent: true,
      },
      {
        source: "/auth/verify-otp",
        destination: "/verify-otp",
        permanent: true,
      },
      {
        source: "/auth/account-pending",
        destination: "/account-pending",
        permanent: true,
      },
      {
        source: "/auth/account-locked",
        destination: "/account-locked",
        permanent: true,
      },
      {
        source: "/auth/access-denied",
        destination: "/access-denied",
        permanent: true,
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: "/docs/:path*",
        destination: "http://localhost:3001/docs/:path*",
      },
      {
        source: "/client/:path*",
        destination: "http://localhost:3002/client/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "http://localhost:3003/admin/:path*",
      },
    ]
  },
}

export default nextConfig
