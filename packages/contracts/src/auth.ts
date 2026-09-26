export type UserRole = "user" | "admin"

export interface ApiUser {
  id: number
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
}

export interface AuthResponse {
  status: string
  message: string
  user: ApiUser
}
