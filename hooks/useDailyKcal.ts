import { DAILY_KCAL_GOAL } from "../lib/config";
import { useSmartwatchCalories } from "./useSmartwatchCalories";

export function useDailyKcal(goal = DAILY_KCAL_GOAL) {
  const { calories, loading, refresh, date, setDate } = useSmartwatchCalories();
  const remaining = Math.max(0, goal - calories);
  return { goal, consumed: calories, remaining, loading, refresh, date, setDate };
}