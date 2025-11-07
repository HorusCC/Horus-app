import { SMARTWATCH_API_URL, SMARTWATCH_TOKEN } from "@/lib/config";
import { todayISO } from "@/lib/dates";

export async function getDailyCalories(dateISO: string = todayISO()) {
  const url = `${SMARTWATCH_API_URL}/metrics/daily?date=${dateISO}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${SMARTWATCH_TOKEN}` }});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Number(data.calories) || 0;
}
