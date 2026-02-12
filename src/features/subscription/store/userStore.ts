import { create } from "zustand";

export type PlanTier = "free" | "pro" | "enterprise";

interface UserState {
  plan: PlanTier;
  isAuthenticated: boolean;
  // No futuro, aqui entrariam dados do usuário como ID, email, etc.
  setUserPlan: (plan: PlanTier) => void;
  setIsAuthenticated: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  plan: "free", // Padrão inicial
  isAuthenticated: false,
  setUserPlan: (plan) => set({ plan }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
}));
