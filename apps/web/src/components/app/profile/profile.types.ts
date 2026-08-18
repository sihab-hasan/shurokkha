export interface ContactInfo {
  fullName: string
  username: string
  email: string
  phone: string
  altPhone?: string
  district: string
  upazila: string
  address: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  altPhone?: string
  notes?: string
}

export interface HouseholdInfo {
  membersCount: number
  dependentsCount: number
  elderlyCount: number
  infantsCount: number
  dwellingType: string
  notes?: string
}

export interface AccessibilityNeeds {
  mobilityAssistance: string
  medicalConditions: string
  medicationRequirements: string
  specialRescueNotes: string
}

export interface UserProfileData {
  contact: ContactInfo
  emergencyContact: EmergencyContact
  household: HouseholdInfo
  accessibility: AccessibilityNeeds
  status: "Verified" | "Active" | "Pending"
  role: "citizen" | "volunteer" | "donor"
  joinedDate: string
  lastUpdated: string
}

export const INITIAL_CITIZEN_PROFILE: UserProfileData = {
  contact: {
    fullName: "Sihab Hasan",
    username: "sihab.xd",
    email: "sihab@example.com",
    phone: "+880 1711-223344",
    altPhone: "+880 1822-334455",
    district: "Sylhet",
    upazila: "Gowainghat",
    address: "House 42, Ward 3, Jaflong Road",
  },
  emergencyContact: {
    name: "Rahim Uddin",
    relationship: "Brother",
    phone: "+880 1933-445566",
    altPhone: "+880 1755-667788",
    notes:
      "Lives in neighboring ward; can provide immediate transport assistance.",
  },
  household: {
    membersCount: 4,
    dependentsCount: 1,
    elderlyCount: 1,
    infantsCount: 0,
    dwellingType: "Semi-pucca (Ground Level)",
    notes:
      "Ground level home near riverbank; high priority evacuation during flash floods.",
  },
  accessibility: {
    mobilityAssistance:
      "Elderly family member requires walking aid / wheelchair assist",
    medicalConditions: "Hypertension and mobility limitation",
    medicationRequirements:
      "Daily blood pressure medication required in emergency kit",
    specialRescueNotes:
      "Requires ground-floor boat assistance during evacuation warnings.",
  },
  status: "Verified",
  role: "citizen",
  joinedDate: "March 2024",
  lastUpdated: "Just now",
}
