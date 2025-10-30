import { useCallback, useEffect, useState } from "react";
import { getDailyCalories } from "@/src/services/smartwatchApi";
import { todayISO } from "../lib/dates";

export function useSmartwatchCalories() {
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayISO());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const total = await getDailyCalories(date);
      setCalories(total);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { refresh(); }, [refresh]);

  return { calories, loading, refresh, date, setDate };
}