export const routes = {
  home: "/",
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    signOut: "/sign-out",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    verifyOtp: "/verify-otp",
    accountPending: "/account-pending",
    accountLocked: "/account-locked",
    accessDenied: "/access-denied",
  },
} as const
