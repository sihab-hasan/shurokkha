import type { ApiClient } from "../client"

import { loginAudits } from "./login-audits"
import { notifications } from "./notifications"
import { privacy } from "./privacy"
import { profile } from "./profile"
import { sessions } from "./sessions"
import { twoFactor } from "./two-factor"

export const makeSettings = (client: ApiClient) => ({
  settings: {
    profile: profile(client),
    notifications: notifications(client),
    privacy: privacy(client),
    sessions: sessions(client),
    twoFactor: twoFactor(client),
    loginAudits: loginAudits(client),
  },
})
