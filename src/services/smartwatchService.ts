// src/services/smartwatchService.ts
import { apiApp } from "../../config/api";
import { SmartwatchMetrics } from "../../types/smartwatch";

const SMARTWATCH_METRICS_PATH = "/smartwatch/metrics";

export async function getSmartwatchMetrics(
  token?: string
): Promise<SmartwatchMetrics> {
  try {
    console.log("[SmartwatchService] Chamando", SMARTWATCH_METRICS_PATH);

    const response = await apiApp.get(SMARTWATCH_METRICS_PATH, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log(
      "[SmartwatchService] Resposta",
      SMARTWATCH_METRICS_PATH,
      response.data
    );

    const data = response.data;

    return {
      calories: Number(data.calories) || 0,
      steps: Number(data.steps) || 0,
    };
  } catch (e: any) {
    console.log(
      "[SmartwatchService] Erro ao chamar",
      SMARTWATCH_METRICS_PATH,
      e?.response?.data || e?.message || e
    );
    throw new Error("Erro ao sincronizar smartwatch");
  }
}
