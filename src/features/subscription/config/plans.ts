import { PlanTier } from "../store/userStore";

export interface FeatureLimits {
  maxFileSize: number; // em bytes
  maxFilesPerBatch: number;
  allowCloudSave: boolean;
  allowAuditTrail: boolean;
  allowTemplates: boolean;
  maxSignaturesSaved: number;
}

// Configuração centralizada dos planos
export const PLAN_LIMITS: Record<PlanTier, FeatureLimits> = {
  free: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerBatch: 1,
    allowCloudSave: false,
    allowAuditTrail: false,
    allowTemplates: false,
    maxSignaturesSaved: 1, // Apenas 1 assinatura salva localmente
  },
  pro: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFilesPerBatch: 20,
    allowCloudSave: true,
    allowAuditTrail: true,
    allowTemplates: true,
    maxSignaturesSaved: 5,
  },
  enterprise: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxFilesPerBatch: 100,
    allowCloudSave: true,
    allowAuditTrail: true,
    allowTemplates: true,
    maxSignaturesSaved: 999,
  },
};

// Feature Flags globais (para habilitar/desabilitar features em toda a app durante dev/rollout)
export const FEATURE_FLAGS = {
  ENABLE_LOGIN: false,
  ENABLE_PAYMENTS: false,
  ENABLE_CLOUD_STORAGE: false,
};
