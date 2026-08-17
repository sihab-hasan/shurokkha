import { routes } from "@/config/routes"

export const publicSiteConfig = {
  brand: {
    name: "Shurokkha",
    tagline: "Trusted disaster information and community support",
    href: "/",
    logoSrc: "/assets/images/logo/Shurokkha.png",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "Disasters", href: "/disasters" },
    { label: "Shelters", href: "/shelters" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  utilityItems: [
    { label: "Emergency alerts", href: "/emergency-alerts" },
    { label: "Live map", href: "/map" },
  ],
  actions: [
    { label: "Sign in", href: routes.auth.signIn, variant: "ghost" },
    { label: "Get help", href: "/get-help", variant: "default" },
  ],
  footerItems: [
    {
      title: "Respond",
      items: [
        { label: "Request help", href: "/get-help" },
        { label: "Emergency alerts", href: "/emergency-alerts" },
        { label: "Find shelters", href: "/shelters" },
        { label: "Live response map", href: "/map" },
      ],
    },
    {
      title: "Prepare",
      items: [
        { label: "Resource library", href: "/resources" },
        { label: "Preparedness guides", href: "/resources/guides" },
        { label: "Support services", href: "/resources/support-services" },
        { label: "Disaster updates", href: "/disasters" },
      ],
    },
    {
      title: "Participate",
      items: [
        { label: "Volunteer", href: "/volunteers" },
        { label: "Donate", href: "/donate" },
        { label: "Fundraise", href: "/fundraise" },
        { label: "How Shurokkha works", href: "/about/how-it-works" },
      ],
    },
    {
      title: "Organization",
      items: [
        { label: "About Shurokkha", href: "/about" },
        { label: "Our mission", href: "/about/mission" },
        { label: "Transparency", href: "/transparency" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  legalItems: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  announcement:
    "When conditions change quickly, use verified alerts, shelter information, and local emergency guidance.",
} as const
