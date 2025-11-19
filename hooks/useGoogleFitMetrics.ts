import { useState, useEffect } from "react";
import { getGoogleFitToday } from "../src/services/googlefitService";

export function useGoogleFitMetrics() {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data = await getGoogleFitToday();
      console.log("GoogleFit data:", data);

      setSteps(data.steps || 0);
      setCalories(data.calories || 0);
    } catch (err: any) {
      console.log(
        "Erro ao carregar métricas:",
        err?.response?.data || err?.message || err
      );
      setError(err?.message || "Erro ao buscar dados do smartwatch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { steps, calories, loading, error, reload: load };
}
