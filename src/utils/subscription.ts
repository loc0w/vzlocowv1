// utils/subscription.ts

export interface PlanFeatures {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    scanLimit: number; // Daily scan limit
    features: string[];
    isPopular?: boolean;
    maxFavorites: number; // Maximum number of favorites
    description: string;
    color: string;
  }
  
  export const SUBSCRIPTION_PLANS: Record<string, PlanFeatures> = {
    FREE: {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      scanLimit: 5,
      maxFavorites: 10,
      description: 'Perfect for casual users',
      color: 'slate',
      features: [
        'Up to 5 daily product scans',
        'Basic email notifications',
        'Maximum 10 favorites',
        'Basic price history',
        '24-hour scan intervals'
      ]
    },
    BASIC: {
      id: 'basic',
      name: 'Basic',
      price: 5,
      interval: 'month',
      scanLimit: 20,
      maxFavorites: 50,
      description: 'Great for regular price tracking',
      color: 'blue',
      features: [
        'Up to 20 daily product scans',
        'Email notifications',
        'Maximum 50 favorites',
        'Price history charts',
        '12-hour scan intervals',
        'Basic price analytics',
        'Priority support'
      ]
    },
    PRO: {
      id: 'pro',
      name: 'Pro',
      price: 12,
      interval: 'month',
      scanLimit: 100,
      maxFavorites: 200,
      description: 'Perfect for power users',
      color: 'purple',
      isPopular: true,
      features: [
        'Up to 100 daily product scans',
        'Instant notifications',
        'Maximum 200 favorites',
        'Advanced price analytics',
        '6-hour scan intervals',
        'Price drop predictions',
        'API access',
        'Priority email support',
        'Custom alert settings'
      ]
    },
    BUSINESS: {
      id: 'business',
      name: 'Business',
      price: 29,
      interval: 'month',
      scanLimit: 300,
      maxFavorites: 1000,
      description: 'For professional users',
      color: 'amber',
      features: [
        'Up to 300 daily product scans',
        'Real-time notifications',
        'Maximum 1000 favorites',
        '1-hour scan intervals',
        'Advanced analytics dashboard',
        'Team collaboration',
        'Priority 24/7 support',
        'Custom features',
        'Dedicated account manager',
        'Bulk import/export',
        'API access with higher limits'
      ]
    }
  };
  
  export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
  
  // Helper functions
  export const getPlanById = (planId: string): PlanFeatures | undefined => {
    return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId);
  };
  
  export const checkScanLimit = (
    currentScans: number,
    planId: string
  ): boolean => {
    const plan = getPlanById(planId);
    if (!plan) return false;
    return currentScans < plan.scanLimit;
  };
  
  export const getRemainingScans = (
    currentScans: number,
    planId: string
  ): number => {
    const plan = getPlanById(planId);
    if (!plan) return 0;
    return Math.max(0, plan.scanLimit - currentScans);
  };
  
  export const canAddMoreFavorites = (
    currentFavorites: number,
    planId: string
  ): boolean => {
    const plan = getPlanById(planId);
    if (!plan) return false;
    return currentFavorites < plan.maxFavorites;
  };
  
  export const getRemainingFavorites = (
    currentFavorites: number,
    planId: string
  ): number => {
    const plan = getPlanById(planId);
    if (!plan) return 0;
    return Math.max(0, plan.maxFavorites - currentFavorites);
  };
  
  // Format price for display
  export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Get scan interval in hours
  export const getScanInterval = (planId: string): number => {
    switch (planId) {
      case 'free':
        return 24;
      case 'basic':
        return 12;
      case 'pro':
        return 6;
      case 'business':
        return 1;
      default:
        return 24;
    }
  };
  
  // Check if plan upgrade is needed
  export const needsUpgrade = (
    currentPlanId: string,
    requiredFeature: 'scanLimit' | 'maxFavorites',
    currentValue: number
  ): boolean => {
    const currentPlan = getPlanById(currentPlanId);
    if (!currentPlan) return true;
  
    return currentValue >= currentPlan[requiredFeature];
  };
  
  // Get recommended upgrade plan
  export const getRecommendedUpgrade = (
    currentPlanId: string,
    requiredFeature: 'scanLimit' | 'maxFavorites',
    requiredValue: number
  ): PlanFeatures | undefined => {
    return Object.values(SUBSCRIPTION_PLANS).find(
      plan => 
        plan.id !== currentPlanId && 
        plan[requiredFeature] >= requiredValue
    );
  };
  
  // Usage example:
  /*
  // Check if user can perform more scans
  const canScan = checkScanLimit(userDailyScans, userPlanId);
  
  // Get remaining scans for the day
  const remaining = getRemainingScans(userDailyScans, userPlanId);
  
  // Check if user can add more favorites
  const canAdd = canAddMoreFavorites(userFavorites.length, userPlanId);
  
  // Get scan interval for plan
  const interval = getScanInterval(userPlanId);
  
  // Check if upgrade is needed
  const upgradeNeeded = needsUpgrade(userPlanId, 'scanLimit', userDailyScans);
  
  // Get recommended upgrade plan
  const upgradePlan = getRecommendedUpgrade(userPlanId, 'scanLimit', requiredScans);
  */