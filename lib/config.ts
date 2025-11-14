import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  API_URL?: string;
  API_TOKEN?: string;
  DAILY_KCAL_GOAL?: number;
};

export const SMARTWATCH_API_URL = extra.API_URL || "http://localhost:8080";
export const SMARTWATCH_TOKEN   = extra.API_TOKEN || "dev-token-qualquer";
export const DAILY_KCAL_GOAL    = extra.DAILY_KCAL_GOAL ?? 2000; // kcal/dia
