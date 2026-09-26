import type {
  AccountDeletionRequest,
  DataExportRequest,
  LoginAudit,
  NotificationPreferences,
  NotificationPreferencesInput,
  PrivacyPreferences,
  PrivacyPreferencesInput,
  Profile,
  ProfileInput,
  RequestAccountDeletionInput,
  RevokeAllSessionsResponse,
  TwoFactorDisableResponse,
  TwoFactorEnableResponse,
  UpdatePasswordInput,
  UserSession,
} from "@shurokkha/contracts"

import { getShurokkhaApi } from "@/lib/api"

/**
 * Thin wrappers around `getShurokkhaApi().settings.*`. We don't pre-validate
 * here — the API client returns typed `ApiResource<T>` payloads, and the
 * feature-side zod schemas (in `@shurokkha/contracts`) are applied at the
 * form layer via zodResolver.
 */

// --- Profile ---------------------------------------------------------------

export async function fetchProfile(): Promise<Profile> {
  const response = await getShurokkhaApi().settings.profile.get()
  return response.data
}

export async function updateProfile(input: ProfileInput): Promise<Profile> {
  const response = await getShurokkhaApi().settings.profile.update(input)
  return response.data
}

export async function updatePassword(
  input: UpdatePasswordInput
): Promise<void> {
  await getShurokkhaApi().settings.profile.updatePassword(input)
}

export async function uploadAvatar(file: File): Promise<Profile> {
  const response = await getShurokkhaApi().settings.profile.uploadAvatar(file)
  return response.data
}

export async function destroyAvatar(): Promise<Profile> {
  const response = await getShurokkhaApi().settings.profile.destroyAvatar()
  return response.data
}

// --- Notification preferences ---------------------------------------------

export async function fetchNotificationPrefs(): Promise<NotificationPreferences> {
  const response = await getShurokkhaApi().settings.notifications.get()
  return response.data
}

export async function updateNotificationPrefs(
  input: NotificationPreferencesInput
): Promise<NotificationPreferences> {
  const response = await getShurokkhaApi().settings.notifications.update(input)
  return response.data
}

// --- Privacy preferences + data export + account deletion ------------------

export async function fetchPrivacyPrefs(): Promise<PrivacyPreferences> {
  const response = await getShurokkhaApi().settings.privacy.get()
  return response.data
}

export async function updatePrivacyPrefs(
  input: PrivacyPreferencesInput
): Promise<PrivacyPreferences> {
  const response = await getShurokkhaApi().settings.privacy.update(input)
  return response.data
}

export async function fetchDataExportRequest(): Promise<DataExportRequest> {
  const response = await getShurokkhaApi().settings.privacy.dataExport.get()
  return response.data
}

export async function requestDataExport(): Promise<DataExportRequest> {
  const response = await getShurokkhaApi().settings.privacy.dataExport.request()
  return response.data
}

export async function fetchAccountDeletionRequest(): Promise<AccountDeletionRequest> {
  const response =
    await getShurokkhaApi().settings.privacy.accountDeletion.get()
  return response.data
}

export async function requestAccountDeletion(
  input: RequestAccountDeletionInput
): Promise<AccountDeletionRequest> {
  const response =
    await getShurokkhaApi().settings.privacy.accountDeletion.request(input)
  return response.data
}

export async function cancelAccountDeletion(): Promise<void> {
  await getShurokkhaApi().settings.privacy.accountDeletion.cancel()
}

// --- Sessions --------------------------------------------------------------

export async function fetchCurrentSession(): Promise<UserSession> {
  const response = await getShurokkhaApi().settings.sessions.current()
  return response.data
}

export async function fetchAllSessions(): Promise<UserSession[]> {
  const response = await getShurokkhaApi().settings.sessions.list()
  return response.data
}

export async function revokeAllSessions(): Promise<RevokeAllSessionsResponse> {
  const response = await getShurokkhaApi().settings.sessions.revokeAll()
  return response.data
}

// --- Two-factor (stub) -----------------------------------------------------

export async function enableTwoFactor(): Promise<TwoFactorEnableResponse> {
  const response = await getShurokkhaApi().settings.twoFactor.enable()
  return response.data
}

export async function disableTwoFactor(): Promise<TwoFactorDisableResponse> {
  const response = await getShurokkhaApi().settings.twoFactor.disable()
  return response.data
}

// --- Login audits ----------------------------------------------------------

export async function fetchLoginAudits(limit = 20): Promise<LoginAudit[]> {
  const response = await getShurokkhaApi().settings.loginAudits.list(limit)
  return response.data
}
