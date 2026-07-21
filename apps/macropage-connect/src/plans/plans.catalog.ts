/**
 * Mirrors the PLANS catalog from macropage-connect's billing/plans.config.ts.
 * There is no "plans" DB collection in the real backend — pricing is defined in code.
 * Keep this in sync manually if the real catalog changes.
 */
export const PLANS_CATALOG = {
  STARTER: {
    name: 'Starter',
    description: 'For small teams getting started',
    features: {
      maxTeamMembers: 3,
      maxContacts: 5000,
      automationRules: 5,
      flowsEnabled: false,
      aiEnabled: false,
    },
    pricing: {
      monthly: { amount: 199900, period: 'monthly' },
      quarterly: { amount: 539700, period: 'monthly' },
      yearly: { amount: 1798800, period: 'yearly' },
    },
  },
  GROWTH: {
    name: 'Growth',
    description: 'For growing businesses',
    features: {
      maxTeamMembers: 10,
      maxContacts: 25000,
      automationRules: -1,
      flowsEnabled: true,
      aiEnabled: false,
    },
    pricing: {
      monthly: { amount: 349900, period: 'monthly' },
      quarterly: { amount: 944730, period: 'monthly' },
      yearly: { amount: 3148800, period: 'yearly' },
    },
  },
  BUSINESS: {
    name: 'Business',
    description: 'For scaling businesses',
    features: {
      maxTeamMembers: 25,
      maxContacts: 100000,
      automationRules: -1,
      flowsEnabled: true,
      aiEnabled: true,
    },
    pricing: {
      monthly: { amount: 899900, period: 'monthly' },
      quarterly: { amount: 2429730, period: 'monthly' },
      yearly: { amount: 8098800, period: 'yearly' },
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS_CATALOG;

export function listPlans() {
  return Object.entries(PLANS_CATALOG).map(([key, value]) => ({
    key,
    ...value,
  }));
}
