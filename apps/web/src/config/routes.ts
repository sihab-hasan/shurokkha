const encodeSegment = (value: string) => encodeURIComponent(value)

export const routes = {
  home: "/",
  public: {
    home: "/",
    disasters: "/disasters",
    shelters: "/shelters",
    resources: "/resources",
    resourceGuides: "/resources/guides",
    supportServices: "/resources/support-services",
    about: "/about",
    howItWorks: "/about/how-it-works",
    mission: "/about/mission",
    contact: "/contact",
    emergencyAlerts: "/emergency-alerts",
    map: "/map",
    news: "/news",
    getHelp: "/get-help",
    volunteers: "/volunteers",
    donate: "/donate",
    fundraise: "/fundraise",
    transparency: "/transparency",
    privacy: "/privacy",
    terms: "/terms",
    accessibility: "/accessibility",
    user: (username: string) => `/u/${encodeSegment(username)}`,
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    signOut: "/sign-out",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    verifyOtp: "/verify-otp",
    accountPending: "/account-pending",
    accountLocked: "/account-locked",
    accessDenied: "/access-denied",
  },
  account: {
    home: "/account",
    dashboard: "/account",
    appeals: "/account/appeals",
    assistance: "/account/assistance",
    createAssistance: "/account/assistance/new",
    assistanceRequest: (requestId: string) =>
      `/account/assistance/${encodeSegment(requestId)}`,
    assistanceAppeal: (requestId: string) =>
      `/account/assistance/${encodeSegment(requestId)}/appeal`,
    complaints: "/account/complaints",
    documents: "/account/documents",
    donations: "/account/donations",
    donation: (donationId: string) =>
      `/account/donations/${encodeSegment(donationId)}`,
    feedback: "/account/feedback",
    feedbackItem: (feedbackId: string) =>
      `/account/feedback/${encodeSegment(feedbackId)}`,
    helpRequests: "/account/help-requests",
    household: "/account/household",
    householdMember: (personId: string) =>
      `/account/household/members/${encodeSegment(personId)}`,
    missingPersons: "/account/missing-persons",
    createMissingPerson: "/account/missing-persons/new",
    missingPerson: (reportId: string) =>
      `/account/missing-persons/${encodeSegment(reportId)}`,
    notifications: "/account/notifications",
    profile: "/account/profile",
    settings: "/account/settings",
    settingsNotifications: "/account/settings/notifications",
    settingsPrivacy: "/account/settings/privacy",
    settingsSecurity: "/account/settings/security",
    settingsSessions: "/account/settings/sessions",
    shelter: "/account/shelter",
    volunteering: "/account/volunteering",
    volunteeringApplication: "/account/volunteering/application",
    volunteeringMission: (missionId: string) =>
      `/account/volunteering/missions/${encodeSegment(missionId)}`,
  },
} as const

export function appRouteSet() {
  return routes.account
}
