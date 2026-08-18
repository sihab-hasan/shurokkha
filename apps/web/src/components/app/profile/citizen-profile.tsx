"use client"

import * as React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react"

import {
  EntityHeader,
  EntityMetadata,
  EntityStatus,
  EntitySummary,
} from "@shurokkha/ui-patterns/entity"
import { WidgetFrame } from "@shurokkha/ui-patterns/dashboard"
import { Alert, AlertDescription } from "@shurokkha/ui/components/alert"
import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@shurokkha/ui/components/card"

import { useProfileData } from "./use-profile-data"
import { EditProfileDialog } from "./edit-profile-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"

interface CitizenProfileProps {
  username: string
}

export default function CitizenProfile({ username }: CitizenProfileProps) {
  const { profile, updateProfile, deleteAccount, saveMessage } =
    useProfileData(username)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <EntityHeader
        title={profile.contact.fullName}
        subtitle="Citizen Profile · Disaster Response & Family Registry"
        identifier={`@${profile.contact.username}`}
        status={
          <EntityStatus tone="success" dot={true}>
            {profile.status}
          </EntityStatus>
        }
        metadata={
          <>
            <span>Member since {profile.joinedDate}</span>
            <span>•</span>
            <span>
              {profile.contact.upazila}, {profile.contact.district}
            </span>
          </>
        }
        actions={
          <div className="flex items-center gap-3">
            <EditProfileDialog profile={profile} onSave={updateProfile} />
          </div>
        }
      />

      {/* Success Notification */}
      {saveMessage ? (
        <Alert variant="default" className="border-success/30 bg-success/10 text-success">
          <CheckCircle2 className="size-4 text-success" />
          <AlertDescription className="text-success font-medium">
            {saveMessage}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        {/* Left Column: Account, Emergency, Household, Accessibility, Danger Zone */}
        <div className="space-y-6">
          {/* 1. Contact Details */}
          <EntitySummary
            title="Contact Details"
            description="Your primary contact information for emergency alerts and notifications."
            actions={
              <EditProfileDialog
                profile={profile}
                onSave={updateProfile}
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                    Edit
                  </Button>
                }
              />
            }
          >
            <EntityMetadata
              columns={2}
              items={[
                {
                  label: "Full Name",
                  value: profile.contact.fullName,
                },
                {
                  label: "Email Address",
                  value: profile.contact.email,
                  hint: "Verified for disaster bulletins",
                },
                {
                  label: "Primary Phone",
                  value: profile.contact.phone,
                  hint: "SMS alerts enabled",
                },
                {
                  label: "Secondary Phone",
                  value: profile.contact.altPhone || "Not specified",
                },
                {
                  label: "Location / Region",
                  value: `${profile.contact.upazila}, ${profile.contact.district}`,
                },
                {
                  label: "Residential Address",
                  value: profile.contact.address,
                },
              ]}
            />
          </EntitySummary>

          {/* 2. Emergency Contact */}
          <EntitySummary
            title="Emergency Contact"
            description="Person to contact immediately during critical rescue operations or evacuations."
            actions={
              <EditProfileDialog
                profile={profile}
                onSave={updateProfile}
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                    Edit
                  </Button>
                }
              />
            }
          >
            <EntityMetadata
              columns={2}
              items={[
                {
                  label: "Contact Person",
                  value: profile.emergencyContact.name,
                },
                {
                  label: "Relationship",
                  value: (
                    <span className="inline-flex items-center gap-2">
                      <span>{profile.emergencyContact.relationship}</span>
                      <Badge variant="secondary" className="text-2xs">
                        Primary
                      </Badge>
                    </span>
                  ),
                },
                {
                  label: "Emergency Phone",
                  value: profile.emergencyContact.phone,
                  hint: "Verified active contact",
                },
                {
                  label: "Secondary Phone",
                  value: profile.emergencyContact.altPhone || "Not specified",
                },
                {
                  label: "Additional Notes",
                  value:
                    profile.emergencyContact.notes ||
                    "No special emergency notes provided.",
                },
              ]}
            />
          </EntitySummary>

          {/* 3. Household Information */}
          <EntitySummary
            title="Household & Family Information"
            description="Used by disaster relief and rescue coordinators to allocate shelter capacity and rations."
            actions={
              <EditProfileDialog
                profile={profile}
                onSave={updateProfile}
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                    Edit
                  </Button>
                }
              />
            }
          >
            <EntityMetadata
              columns={2}
              items={[
                {
                  label: "Household Members",
                  value: `${profile.household.membersCount} people`,
                  hint: "Total family members in residence",
                },
                {
                  label: "Dependents",
                  value: `${profile.household.dependentsCount} listed`,
                  hint: "Children, elderly, or disabled members",
                },
                {
                  label: "Elderly Members (60+)",
                  value: `${profile.household.elderlyCount} person(s)`,
                },
                {
                  label: "Infants / Children (0-4)",
                  value: `${profile.household.infantsCount} infant(s)`,
                },
                {
                  label: "Dwelling Vulnerability",
                  value: profile.household.dwellingType,
                },
                {
                  label: "Evacuation Notes",
                  value:
                    profile.household.notes ||
                    "No specific dwelling evacuation notes.",
                },
              ]}
            />
          </EntitySummary>

          {/* 4. Accessibility Needs */}
          <EntitySummary
            title="Accessibility & Special Needs"
            description="Critical medical and mobility details shared with field response teams."
            actions={
              <EditProfileDialog
                profile={profile}
                onSave={updateProfile}
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                    Edit
                  </Button>
                }
              />
            }
          >
            <EntityMetadata
              columns={2}
              items={[
                {
                  label: "Mobility Assistance",
                  value: profile.accessibility.mobilityAssistance || "None required",
                },
                {
                  label: "Medical Conditions",
                  value: profile.accessibility.medicalConditions || "None recorded",
                },
                {
                  label: "Medication Requirements",
                  value:
                    profile.accessibility.medicationRequirements ||
                    "None recorded",
                },
                {
                  label: "Rescue Team Instructions",
                  value:
                    profile.accessibility.specialRescueNotes ||
                    "Standard evacuation protocol.",
                },
              ]}
            />
          </EntitySummary>

          {/* 5. Danger Zone (Account Deletion) */}
          <Card className="border-danger/30 bg-danger/5">
            <CardHeader className="border-b border-danger/15 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-danger flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    <span>Danger Zone</span>
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Irreversible account operations and data removal.
                  </p>
                </div>
                <DeleteAccountDialog
                  username={profile.contact.username}
                  onDelete={deleteAccount}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-3 text-xs leading-relaxed text-muted-foreground">
              Permanently deleting your account will purge all contact records,
              household details, emergency contact mappings, and active assistance
              requests from Shurokkha.
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Widgets & Readiness */}
        <div className="space-y-6">
          {/* Readiness Status */}
          <WidgetFrame
            title="Emergency Readiness"
            description="Status of your relief and shelter registry."
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <ShieldCheck className="size-5 shrink-0 text-success mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">
                    Profile Verified
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    Your contact is verified for high-priority emergency alerts.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <Users className="size-5 shrink-0 text-primary mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">
                    {profile.household.membersCount} Household Members
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    Pre-registered for shelter capacity and relief allocation.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <HeartPulse className="size-5 shrink-0 text-info mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">
                    Accessibility Needs Recorded
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    Field rescue units receive specialized mobility instructions.
                  </div>
                </div>
              </div>
            </div>
          </WidgetFrame>

          {/* Privacy & Permissions */}
          <WidgetFrame
            title="Privacy & Data Control"
            description="How your sensitive information is handled."
          >
            <p className="text-xs leading-6 text-muted-foreground">
              Sensitive household, accessibility, and emergency contact details
              remain strictly scoped to authorized Shurokkha disaster relief
              coordinators and verified first responders during active crises.
            </p>
          </WidgetFrame>

          {/* Emergency Hotlines */}
          <WidgetFrame
            title="Emergency Hotlines"
            description="Direct national emergency dispatch services."
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-md bg-muted/60 p-2.5">
                <span className="font-medium text-foreground">
                  National Emergency Service
                </span>
                <span className="font-mono font-bold text-primary">999</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/60 p-2.5">
                <span className="font-medium text-foreground">
                  Disaster Warning & Relief
                </span>
                <span className="font-mono font-bold text-primary">1090</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/60 p-2.5">
                <span className="font-medium text-foreground">
                  National Health Helpline
                </span>
                <span className="font-mono font-bold text-primary">16263</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/60 p-2.5">
                <span className="font-medium text-foreground">
                  Government Services
                </span>
                <span className="font-mono font-bold text-primary">333</span>
              </div>
            </div>
          </WidgetFrame>
        </div>
      </div>
    </div>
  )
}
