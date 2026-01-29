import { useUserStore } from "../store/userStore";
import { PLAN_LIMITS, FeatureLimits } from "../config/plans";

// Hook para verificar permissões de forma fácil nos componentes
export function useFeatureAccess() {
  const { plan } = useUserStore();
  
  const limits = PLAN_LIMITS[plan];

  const can = (feature: keyof FeatureLimits, valueToCheck?: number): boolean => {
    const limit = limits[feature];

    if (typeof limit === 'boolean') {
      return limit;
    }

    if (typeof limit === 'number' && typeof valueToCheck === 'number') {
      return valueToCheck <= limit;
    }

    return false;
  };

  return {
    plan,
    limits,
    can,
    isPro: plan !== 'free',
  };
}
