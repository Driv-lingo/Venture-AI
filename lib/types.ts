// Validation result types
export interface ValidationResult {
  marketDemand: number;
  competitorGaps: number;
  profitability: number;
  riskScore: number;
  revenueProjections: {
    month1: { min: number; max: number };
    month3: { min: number; max: number };
    month6: { min: number; max: number };
  };
  risks: Array<{
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  actionPlan: Array<{
    step: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: string;
  }>;
}

// Business launch wizard step data
export interface LaunchWizardData {
  step: number;
  domainSuggestions?: string[];
  selectedDomain?: string;
  brandIdentity?: {
    logoDescription: string;
    colorPalette: string[];
    tagline: string;
  };
  mvpSpec?: {
    features: string[];
    userFlow: string;
    techStack: string[];
  };
  landingPageCopy?: {
    headline: string;
    subheadline: string;
    cta: string;
    benefits: string[];
  };
  marketingStrategy?: {
    channels: Array<{ channel: string; budget: number }>;
    contentPlan: string[];
  };
  pricingModel?: {
    tiers: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  };
  legalChecklist?: {
    items: Array<{ item: string; completed: boolean }>;
  };
}

// Opportunity detection source types
export interface OpportunitySource {
  type: 'google_trends' | 'reddit' | 'product_hunt' | 'indie_hackers';
  data: Record<string, unknown>;
  detectedAt: string;
}

// User onboarding data
export interface OnboardingData {
  skills: string[];
  interests: string[];
  capital: 'under1k' | '1k-5k' | '5k-plus';
  timeCommitment: 'sideHustle' | 'partTime' | 'fullTime';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Business metrics aggregation
export interface BusinessMetricsAggregation {
  totalVisitors: number;
  totalLeads: number;
  totalCustomers: number;
  totalRevenue: number;
  conversionRate: number;
  averageRevenuePerCustomer: number;
  growthRate: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  metadata?: Record<string, unknown>;
}
