import { AppProfile } from "@/components/app/app-profile"

export default function VolunteerProfile({ username }: { username: string }) {
  return (
    <AppProfile
      username={username}
      description="Keep your volunteer skills, availability, and emergency information current."
      items={[
        {
          label: "Volunteer identity",
          value: "VOL-1042",
          hint: "Identity verified",
          status: "Active",
        },
        {
          label: "Skills",
          value: "Logistics, shelter support, basic first aid",
        },
        {
          label: "Availability",
          value: "Monday–Saturday",
          hint: "8:00 AM–6:00 PM",
        },
        {
          label: "Certifications",
          value: "Field safety complete",
          hint: "First-aid refresher scheduled",
        },
        {
          label: "Emergency contact",
          value: "One contact on file",
          status: "Verified",
        },
      ]}
      asideTitle="Field readiness"
      asideDescription="Coordinators use this information when matching you with safe, suitable assignments."
    />
  )
}
