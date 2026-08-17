import { AppProfile } from "@/components/app/app-profile"

export default function DonorProfile({ username }: { username: string }) {
  return (
    <AppProfile
      username={username}
      description="Review the information associated with your donor account."
      items={[
        {
          label: "Donor identity",
          value: "Individual donor",
          hint: "Identity verified",
          status: "Verified",
        },
        {
          label: "Contact information",
          value: "Primary email and phone",
          hint: "Current",
        },
        {
          label: "Receipt details",
          value: "Sihab Hasan",
          hint: "Default receipt name",
        },
        {
          label: "Donation visibility",
          value: "Public donor name hidden",
          status: "Anonymous",
        },
      ]}
      asideTitle="Donor privacy"
      asideDescription="Your contact, payment, and donation history remain private to your account."
    />
  )
}
