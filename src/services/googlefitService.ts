import { apiSmart } from "../../services/api"; // seu axios

export async function getGoogleFitToday() {
  const res = await apiSmart.get("/metrics");
  return res.data;
}
