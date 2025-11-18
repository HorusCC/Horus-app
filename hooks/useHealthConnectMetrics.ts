// hooks/useSmartwatchCalories.ts
import { useState, useCallback } from "react";
import { getSmartwatchMetrics } from "../src/services/smartwatchService";

export function useSmartwatchCalories() {
  const [calories, setCalories] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSmartwatchMetrics(); // 👈 chama backend

      setCalories(
        Number.isFinite(data.calories) ? Math.round(data.calories) : 0
      );
      setSteps(Number.isFinite(data.steps) ? Math.round(data.steps) : 0);
    } catch (err: any) {
      console.error("Erro ao buscar dados do smartwatch:", err);
      setError(err?.message ?? "Erro ao sincronizar smartwatch");
      setCalories(0);
      setSteps(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return { calories, steps, loading, error, refresh };
}
