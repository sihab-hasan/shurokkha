"use client"

import * as React from "react"
import { INITIAL_CITIZEN_PROFILE, type UserProfileData } from "./profile.types"

// In-memory store for session state without storing sensitive PII / emergency contacts in plain-text localStorage
const profileStore = new Map<string, UserProfileData>()

function getInitialProfile(username: string): UserProfileData {
  const normalizedKey = username.toLowerCase()
  const existing = profileStore.get(normalizedKey)
  if (existing) {
    return existing
  }

  const initial: UserProfileData = {
    ...INITIAL_CITIZEN_PROFILE,
    contact: {
      ...INITIAL_CITIZEN_PROFILE.contact,
      username,
    },
  }
  profileStore.set(normalizedKey, initial)
  return initial
}

export function useProfileData(username: string = "sihab.xd") {
  const normalizedKey = username.toLowerCase()
  const [profile, setProfile] = React.useState<UserProfileData>(() =>
    getInitialProfile(username)
  )
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)

  const updateProfile = React.useCallback(
    (updated: Partial<UserProfileData>) => {
      setProfile((prev) => {
        const next: UserProfileData = {
          ...prev,
          ...updated,
          contact: {
            ...prev.contact,
            ...(updated.contact ?? {}),
          },
          emergencyContact: {
            ...prev.emergencyContact,
            ...(updated.emergencyContact ?? {}),
          },
          household: {
            ...prev.household,
            ...(updated.household ?? {}),
          },
          accessibility: {
            ...prev.accessibility,
            ...(updated.accessibility ?? {}),
          },
          lastUpdated: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }

        profileStore.set(normalizedKey, next)
        setSaveMessage("Profile updated successfully")
        setTimeout(() => setSaveMessage(null), 4000)

        return next
      })
    },
    [normalizedKey]
  )

  const deleteAccount = React.useCallback(() => {
    const resetProfile: UserProfileData = {
      ...INITIAL_CITIZEN_PROFILE,
      contact: {
        ...INITIAL_CITIZEN_PROFILE.contact,
        username,
      },
    }
    profileStore.set(normalizedKey, resetProfile)
    setProfile(resetProfile)
  }, [normalizedKey, username])

  return {
    profile,
    updateProfile,
    deleteAccount,
    saveMessage,
    clearSaveMessage: () => setSaveMessage(null),
  }
}
