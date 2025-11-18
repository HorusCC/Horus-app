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
      const data = await getGoogleFitToday();
      setSteps(data.steps || 0);
      setCalories(data.calories || 0);
    } catch (err) {
      console.log(err);
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { steps, calories, loading, error, reload: load };
}
