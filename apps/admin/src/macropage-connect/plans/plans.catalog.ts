/**
 * Mirrors the real macropage-connect portal's pricing data exactly —
 * `PLAN_PRICING` from `billing.constants.ts`, served to the public pricing
 * page via `GET /billing/plans`. This is NOT the same as `billing/plans.config.ts`
 * (that one only holds internal Razorpay plan IDs) — this is what customers
 * actually see: monthly/quarterly/yearly display pricing, savings, badges,
 * marketing feature lists, and the ENTERPRISE tier.
 * There is no "plans" DB collection in the real backend — keep this in sync
 * manually if the real portal's pricing changes.
 */
export const PLAN_PRICING = [
  {
    id: 'STARTER',
    name: 'Starter',
    desc: 'Perfect to explore and get started with WhatsApp API.',
    badge: '14-Day Trial',
    highlight: false,
    cta: 'Start Free',
    ctaHref: 'https://app.macropage.in/register',
    currency: 'INR',
    pricing: {
      monthly: { price: 1999, billedAs: '₹1,999/month' },
      quarterly: {
        price: 1799,
        billedAs: '₹5,397 every 3 months',
        savings: 'Save 10%',
      },
      yearly: { price: 1499, billedAs: '₹17,988/year', savings: 'Save 25%' },
    },
    features: [
      '1 WhatsApp Business Number',
      'Up to 1,000 messages/month',
      'Basic Chatbot Builder',
      'Shared Team Inbox',
      'Message Templates (5)',
      'Basic Analytics',
      'Email Support',
    ],
    notIncluded: [
      'Bulk Broadcasts',
      'CRM Integration',
      'API Access',
      'Dedicated Manager',
    ],
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    desc: 'For growing businesses ready to scale their WhatsApp marketing.',
    badge: 'Most Popular',
    highlight: true,
    cta: 'Start Free Trial',
    ctaHref: 'https://app.macropage.in/register',
    currency: 'INR',
    pricing: {
      monthly: { price: 3499, billedAs: '₹3,499/month' },
      quarterly: {
        price: 3149,
        billedAs: '₹9,447 every 3 months',
        savings: 'Save 10%',
      },
      yearly: { price: 2624, billedAs: '₹31,488/year', savings: 'Save 25%' },
    },
    features: [
      '3 WhatsApp Business Numbers',
      'Up to 25,000 messages/month',
      'Advanced Chatbot & Flows',
      'Team Inbox (5 agents)',
      'Unlimited Templates',
      'Bulk Broadcast Campaigns',
      'Basic CRM Integration',
      'Full Analytics Dashboard',
      'Priority Email & Chat Support',
    ],
    notIncluded: ['Dedicated Manager', 'Custom API Rate Limits'],
  },
  {
    id: 'BUSINESS',
    name: 'Scale',
    desc: 'For established businesses that need enterprise-grade power.',
    badge: null,
    highlight: false,
    cta: 'Start Free Trial',
    ctaHref: 'https://app.macropage.in/register',
    currency: 'INR',
    pricing: {
      monthly: { price: 8999, billedAs: '₹8,999/month' },
      quarterly: {
        price: 8099,
        billedAs: '₹24,297 every 3 months',
        savings: 'Save 10%',
      },
      yearly: { price: 6749, billedAs: '₹80,988/year', savings: 'Save 25%' },
    },
    features: [
      'Unlimited WhatsApp Numbers',
      'Unlimited Messages',
      'Full Automation Suite',
      'Unlimited Agents',
      'Unlimited Templates',
      'Bulk Broadcasts + Scheduling',
      'Full CRM & API Integration',
      'Advanced Analytics & Reports',
      'Webhooks & Custom Integrations',
      'Dedicated Account Manager',
      'SLA-backed Uptime',
    ],
    notIncluded: [],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    desc: 'Custom solutions for large teams with advanced needs.',
    badge: null,
    highlight: false,
    cta: 'Contact Sales',
    ctaHref: 'mailto:sales@macropage.in',
    currency: 'INR',
    custom: true,
    pricing: {
      monthly: { price: 0, billedAs: 'Custom pricing' },
      quarterly: { price: 0, billedAs: 'Custom pricing' },
      yearly: { price: 0, billedAs: 'Custom pricing' },
    },
    features: [
      'Everything in Scale',
      'Custom Integrations',
      'Dedicated Infrastructure',
      'Custom SLA',
      'Priority Onboarding',
    ],
    notIncluded: [],
  },
] as const;

export type PlanKey = 'STARTER' | 'GROWTH' | 'BUSINESS' | 'ENTERPRISE';

export function listPlans() {
  return PLAN_PRICING;
}
