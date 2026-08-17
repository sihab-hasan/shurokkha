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
  citizen: {
    home: "/citizen",
    requestHelp: "/citizen/request-help",
    requests: "/citizen/requests",
    request: (requestId: string) =>
      `/citizen/requests/${encodeSegment(requestId)}`,
    shelters: "/citizen/shelters",
    shelter: (shelterId: string) =>
      `/citizen/shelters/${encodeSegment(shelterId)}`,
    alerts: "/citizen/alerts",
    alert: (alertId: string) => `/citizen/alerts/${encodeSegment(alertId)}`,
    disasters: "/citizen/disasters",
    disaster: (disasterId: string) =>
      `/citizen/disasters/${encodeSegment(disasterId)}`,
    missingPersons: "/citizen/missing-persons",
    createMissingPerson: "/citizen/missing-persons/create",
    missingPerson: (personId: string) =>
      `/citizen/missing-persons/${encodeSegment(personId)}`,
    safety: "/citizen/safety",
    messages: "/citizen/messages",
    conversation: (conversationId: string) =>
      `/citizen/messages/${encodeSegment(conversationId)}`,
    notifications: "/citizen/notifications",
    profile: "/citizen/profile",
    settings: "/citizen/settings",
  },
  donor: {
    home: "/donor",
    donate: "/donor/donate",
    donateToCampaign: (campaignId: string) =>
      `/donor/donate/${encodeSegment(campaignId)}`,
    donations: "/donor/donations",
    donation: (donationId: string) =>
      `/donor/donations/${encodeSegment(donationId)}`,
    contributions: "/donor/contributions",
    contribution: (contributionId: string) =>
      `/donor/contributions/${encodeSegment(contributionId)}`,
    tracking: "/donor/tracking",
    trackingItem: (trackingId: string) =>
      `/donor/tracking/${encodeSegment(trackingId)}`,
    campaigns: "/donor/campaigns",
    campaign: (campaignId: string) =>
      `/donor/campaigns/${encodeSegment(campaignId)}`,
    receipts: "/donor/receipts",
    receipt: (receiptId: string) =>
      `/donor/receipts/${encodeSegment(receiptId)}`,
    impact: "/donor/impact",
    alerts: "/donor/alerts",
    alert: (alertId: string) => `/donor/alerts/${encodeSegment(alertId)}`,
    messages: "/donor/messages",
    conversation: (conversationId: string) =>
      `/donor/messages/${encodeSegment(conversationId)}`,
    notifications: "/donor/notifications",
    profile: "/donor/profile",
    settings: "/donor/settings",
  },
  volunteer: {
    home: "/volunteer",
    assignments: "/volunteer/assignments",
    assignment: (assignmentId: string) =>
      `/volunteer/assignments/${encodeSegment(assignmentId)}`,
    missions: "/volunteer/missions",
    mission: (missionId: string) =>
      `/volunteer/missions/${encodeSegment(missionId)}`,
    distributions: "/volunteer/distributions",
    distribution: (distributionId: string) =>
      `/volunteer/distributions/${encodeSegment(distributionId)}`,
    shelters: "/volunteer/shelters",
    shelter: (shelterId: string) =>
      `/volunteer/shelters/${encodeSegment(shelterId)}`,
    schedule: "/volunteer/schedule",
    shift: (shiftId: string) => `/volunteer/schedule/${encodeSegment(shiftId)}`,
    team: "/volunteer/team",
    training: "/volunteer/training",
    trainingItem: (trainingId: string) =>
      `/volunteer/training/${encodeSegment(trainingId)}`,
    alerts: "/volunteer/alerts",
    alert: (alertId: string) => `/volunteer/alerts/${encodeSegment(alertId)}`,
    messages: "/volunteer/messages",
    conversation: (conversationId: string) =>
      `/volunteer/messages/${encodeSegment(conversationId)}`,
    notifications: "/volunteer/notifications",
    profile: "/volunteer/profile",
    settings: "/volunteer/settings",
  },
} as const

export type AppRouteRole = "citizen" | "donor" | "volunteer"

export function appRouteSet(role: AppRouteRole) {
  return routes[role]
}
