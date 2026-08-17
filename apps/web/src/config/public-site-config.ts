import { routes } from "@/config/routes"

export const publicSiteConfig = {
  brand: {
    name: "Shurokkha",
    tagline: "Trusted disaster information and community support",
    href: routes.public.home,
    logoSrc: "/logos/shurokkha-logo.png",
  },
  navItems: [
    { label: "Home", href: routes.public.home },
    { label: "Disasters", href: routes.public.disasters },
    { label: "Shelters", href: routes.public.shelters },
    { label: "Resources", href: routes.public.resources },
    { label: "About", href: routes.public.about },
    { label: "Contact", href: routes.public.contact },
  ],
  utilityItems: [
    { label: "Emergency alerts", href: routes.public.emergencyAlerts },
    { label: "Live map", href: routes.public.map },
  ],
  footerItems: [
    {
      title: "Respond",
      items: [
        { label: "Request help", href: routes.public.getHelp },
        { label: "Emergency alerts", href: routes.public.emergencyAlerts },
        { label: "Find shelters", href: routes.public.shelters },
        { label: "Live response map", href: routes.public.map },
      ],
    },
    {
      title: "Prepare",
      items: [
        { label: "Resource library", href: routes.public.resources },
        { label: "Preparedness guides", href: routes.public.resourceGuides },
        { label: "Support services", href: routes.public.supportServices },
        { label: "Disaster updates", href: routes.public.disasters },
      ],
    },
    {
      title: "Participate",
      items: [
        { label: "Volunteer", href: routes.public.volunteers },
        { label: "Donate", href: routes.public.donate },
        { label: "Fundraise", href: routes.public.fundraise },
        { label: "How Shurokkha works", href: routes.public.howItWorks },
      ],
    },
    {
      title: "Organization",
      items: [
        { label: "About Shurokkha", href: routes.public.about },
        { label: "Our mission", href: routes.public.mission },
        { label: "Transparency", href: routes.public.transparency },
        { label: "Contact", href: routes.public.contact },
      ],
    },
  ],
  legalItems: [
    { label: "Privacy", href: routes.public.privacy },
    { label: "Terms", href: routes.public.terms },
    { label: "Accessibility", href: routes.public.accessibility },
  ],
  announcement:
    "When conditions change quickly, use verified alerts, shelter information, and local emergency guidance.",
} as const
