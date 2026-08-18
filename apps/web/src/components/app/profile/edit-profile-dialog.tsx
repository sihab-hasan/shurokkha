"use client"

import * as React from "react"
import {
  Accessibility,
  Home,
  Pencil,
  PhoneCall,
  Save,
  User,
} from "lucide-react"

import { Button } from "@shurokkha/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shurokkha/ui/components/dialog"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import {
  NativeSelect,
  NativeSelectOption,
} from "@shurokkha/ui/components/native-select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shurokkha/ui/components/tabs"
import { Textarea } from "@shurokkha/ui/components/textarea"
import type { UserProfileData } from "./profile.types"

interface EditProfileDialogProps {
  profile: UserProfileData
  onSave: (updated: Partial<UserProfileData>) => void
  trigger?: React.ReactNode
}

export function EditProfileDialog({
  profile,
  onSave,
  trigger,
}: EditProfileDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("contact")
  const [formData, setFormData] = React.useState<UserProfileData>(profile)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setFormData(profile)
      setActiveTab("contact")
    }
  }

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }))
  }

  const handleEmergencyChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }))
  }

  const handleHouseholdChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      household: {
        ...prev.household,
        [field]: value,
      },
    }))
  }

  const handleAccessibilityChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="size-4" />
              <span>Edit profile</span>
            </Button>
          )
        }
      />

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Account Profile</DialogTitle>
            <DialogDescription>
              Update your contact details, emergency contacts, household
              information, and accessibility needs.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="contact" className="gap-1.5 text-xs sm:text-sm">
                  <User className="size-3.5 hidden sm:inline" />
                  <span>Contact</span>
                </TabsTrigger>
                <TabsTrigger
                  value="emergency"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <PhoneCall className="size-3.5 hidden sm:inline" />
                  <span>Emergency</span>
                </TabsTrigger>
                <TabsTrigger
                  value="household"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <Home className="size-3.5 hidden sm:inline" />
                  <span>Household</span>
                </TabsTrigger>
                <TabsTrigger
                  value="accessibility"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <Accessibility className="size-3.5 hidden sm:inline" />
                  <span>Needs</span>
                </TabsTrigger>
              </TabsList>

              {/* 1. Contact Info Tab */}
              <TabsContent value="contact" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-fullName">Full name</Label>
                    <Input
                      id="edit-fullName"
                      value={formData.contact.fullName}
                      onChange={(e) =>
                        handleContactChange("fullName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-email">Email address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-phone">Primary phone number</Label>
                    <Input
                      id="edit-phone"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        handleContactChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-altPhone">Alternative phone (optional)</Label>
                    <Input
                      id="edit-altPhone"
                      value={formData.contact.altPhone || ""}
                      onChange={(e) =>
                        handleContactChange("altPhone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-district">District</Label>
                    <Input
                      id="edit-district"
                      value={formData.contact.district}
                      onChange={(e) =>
                        handleContactChange("district", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-upazila">Upazila</Label>
                    <Input
                      id="edit-upazila"
                      value={formData.contact.upazila}
                      onChange={(e) =>
                        handleContactChange("upazila", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-address">Residential address</Label>
                  <Textarea
                    id="edit-address"
                    rows={2}
                    value={formData.contact.address}
                    onChange={(e) =>
                      handleContactChange("address", e.target.value)
                    }
                    placeholder="House, road, landmark, village/ward"
                  />
                </div>
              </TabsContent>

              {/* 2. Emergency Contact Tab */}
              <TabsContent value="emergency" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-em-name">Emergency contact person</Label>
                    <Input
                      id="edit-em-name"
                      value={formData.emergencyContact.name}
                      onChange={(e) =>
                        handleEmergencyChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-em-rel">Relationship</Label>
                    <NativeSelect
                      id="edit-em-rel"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) =>
                        handleEmergencyChange("relationship", e.target.value)
                      }
                      className="w-full"
                    >
                      <NativeSelectOption value="Parent">Parent</NativeSelectOption>
                      <NativeSelectOption value="Spouse">Spouse</NativeSelectOption>
                      <NativeSelectOption value="Sibling">Sibling</NativeSelectOption>
                      <NativeSelectOption value="Child">Child</NativeSelectOption>
                      <NativeSelectOption value="Relative">Relative</NativeSelectOption>
                      <NativeSelectOption value="Friend">Friend</NativeSelectOption>
                      <NativeSelectOption value="Neighbor">Neighbor</NativeSelectOption>
                    </NativeSelect>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-em-phone">Emergency phone number</Label>
                    <Input
                      id="edit-em-phone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) =>
                        handleEmergencyChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-em-altPhone">
                      Secondary contact phone
                    </Label>
                    <Input
                      id="edit-em-altPhone"
                      value={formData.emergencyContact.altPhone || ""}
                      onChange={(e) =>
                        handleEmergencyChange("altPhone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-em-notes">Emergency contact notes</Label>
                  <Textarea
                    id="edit-em-notes"
                    rows={2}
                    value={formData.emergencyContact.notes || ""}
                    onChange={(e) =>
                      handleEmergencyChange("notes", e.target.value)
                    }
                    placeholder="E.g., Lives nearby, has vehicle for emergency transit."
                  />
                </div>
              </TabsContent>

              {/* 3. Household Tab */}
              <TabsContent value="household" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hh-members">Total household members</Label>
                    <Input
                      id="edit-hh-members"
                      type="number"
                      min={1}
                      max={30}
                      value={formData.household.membersCount}
                      onChange={(e) =>
                        handleHouseholdChange(
                          "membersCount",
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hh-dependents">Dependents (children / disabled)</Label>
                    <Input
                      id="edit-hh-dependents"
                      type="number"
                      min={0}
                      max={20}
                      value={formData.household.dependentsCount}
                      onChange={(e) =>
                        handleHouseholdChange(
                          "dependentsCount",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hh-elderly">Elderly members (60+ yrs)</Label>
                    <Input
                      id="edit-hh-elderly"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.household.elderlyCount}
                      onChange={(e) =>
                        handleHouseholdChange(
                          "elderlyCount",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hh-infants">Infants / toddlers (0-4 yrs)</Label>
                    <Input
                      id="edit-hh-infants"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.household.infantsCount}
                      onChange={(e) =>
                        handleHouseholdChange(
                          "infantsCount",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-hh-dwelling">Dwelling / shelter vulnerability</Label>
                  <NativeSelect
                    id="edit-hh-dwelling"
                    value={formData.household.dwellingType}
                    onChange={(e) =>
                      handleHouseholdChange(
                        "dwellingType",
                        e.target.value
                      )
                    }
                    className="w-full"
                  >
                    <NativeSelectOption value="Semi-pucca (Ground Level)">
                      Semi-pucca (Ground Level)
                    </NativeSelectOption>
                    <NativeSelectOption value="Pucca / Multi-story Concrete">
                      Pucca / Multi-story Concrete
                    </NativeSelectOption>
                    <NativeSelectOption value="Tin shed / Corrugated Sheet">
                      Tin shed / Corrugated Sheet
                    </NativeSelectOption>
                    <NativeSelectOption value="Katcha / Mud & Bamboo">
                      Katcha / Mud & Bamboo
                    </NativeSelectOption>
                    <NativeSelectOption value="Flood-prone Island / Char">
                      Flood-prone Island / Char
                    </NativeSelectOption>
                  </NativeSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-hh-notes">Household evacuation notes</Label>
                  <Textarea
                    id="edit-hh-notes"
                    rows={2}
                    value={formData.household.notes || ""}
                    onChange={(e) =>
                      handleHouseholdChange("notes", e.target.value)
                    }
                    placeholder="Specific factors response teams should know when coordinating shelter or transport."
                  />
                </div>
              </TabsContent>

              {/* 4. Accessibility & Assistance Tab */}
              <TabsContent value="accessibility" className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-acc-mobility">Mobility assistance requirements</Label>
                  <Input
                    id="edit-acc-mobility"
                    value={formData.accessibility.mobilityAssistance}
                    onChange={(e) =>
                      handleAccessibilityChange(
                        "mobilityAssistance",
                        e.target.value
                      )
                    }
                    placeholder="E.g., Wheelchair user, walking aid, stretcher required, None"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-acc-medical">Chronic medical conditions</Label>
                  <Input
                    id="edit-acc-medical"
                    value={formData.accessibility.medicalConditions}
                    onChange={(e) =>
                      handleAccessibilityChange(
                        "medicalConditions",
                        e.target.value
                      )
                    }
                    placeholder="E.g., Hypertension, asthma, diabetes, heart condition"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-acc-medication">
                    Critical emergency medication requirements
                  </Label>
                  <Input
                    id="edit-acc-medication"
                    value={formData.accessibility.medicationRequirements}
                    onChange={(e) =>
                      handleAccessibilityChange(
                        "medicationRequirements",
                        e.target.value
                      )
                    }
                    placeholder="E.g., Insulin refrigeration, daily inhaler, dialysis support"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-acc-rescue">
                    Rescue & field team instructions
                  </Label>
                  <Textarea
                    id="edit-acc-rescue"
                    rows={2}
                    value={formData.accessibility.specialRescueNotes}
                    onChange={(e) =>
                      handleAccessibilityChange(
                        "specialRescueNotes",
                        e.target.value
                      )
                    }
                    placeholder="Special instructions for emergency dispatch, medical teams, or shelter allocation."
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" className="gap-2">
              <Save className="size-4" />
              <span>Save changes</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
