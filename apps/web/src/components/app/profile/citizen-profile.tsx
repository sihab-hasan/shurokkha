import { AppProfile } from "@/components/app/app-profile"

interface CitizenProfileProps {
  username: string
}

export default function CitizenProfile({ username }: CitizenProfileProps) {
  return (
    <AppProfile
      username={username}
      description="Review the information response teams use to support you."
      items={[
        {
          label: "Contact details",
          value: "Primary phone and emergency contact",
          hint: "Verified",
          status: "Verified",
        },
        {
          label: "Household information",
          value: "Four household members",
          hint: "One dependent listed",
        },
        {
          label: "Accessibility needs",
          value: "Mobility assistance",
          hint: "Included in active requests",
        },
      ]}
      asideTitle="Privacy"
      asideDescription="Only authorized response personnel can access sensitive profile information."
    />
  )
}
