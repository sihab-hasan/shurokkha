"use client"

import * as React from "react"
import { INITIAL_CITIZEN_PROFILE, type UserProfileData } from "./profile.types"

const STORAGE_PREFIX = "shurokkha_profile_"

function getInitialProfile(username: string): UserProfileData {
  if (typeof window === "undefined") {
    return {
      ...INITIAL_CITIZEN_PROFILE,
      contact: {
        ...INITIAL_CITIZEN_PROFILE.contact,
        username,
      },
    }
  }

  try {
    const storageKey = `${STORAGE_PREFIX}${username.toLowerCase()}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      return JSON.parse(stored) as UserProfileData
    }
  } catch {
    // Return initial profile on error
  }

  return {
    ...INITIAL_CITIZEN_PROFILE,
    contact: {
      ...INITIAL_CITIZEN_PROFILE.contact,
      username,
    },
  }
}

export function useProfileData(username: string = "sihab.xd") {
  const storageKey = `${STORAGE_PREFIX}${username.toLowerCase()}`
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

        try {
          localStorage.setItem(storageKey, JSON.stringify(next))
        } catch {
          // Fallback if storage fails
        }

        setSaveMessage("Profile updated successfully")
        setTimeout(() => setSaveMessage(null), 4000)

        return next
      })
    },
    [storageKey]
  )

  const deleteAccount = React.useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage clear failure
    }
    setProfile({
      ...INITIAL_CITIZEN_PROFILE,
      contact: {
        ...INITIAL_CITIZEN_PROFILE.contact,
        username,
      },
    })
  }, [storageKey, username])

  return {
    profile,
    updateProfile,
    deleteAccount,
    saveMessage,
    clearSaveMessage: () => setSaveMessage(null),
  }
}
