import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign in · Shurokkha Admin",
  description: "Sign in to the Shurokkha admin console.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background p-6 sm:p-10">
      <LoginForm />
    </main>
  )
}
