import { apiSmart } from "../../services/api"; // seu axios

export async function getGoogleFitToday() {
  const res = await apiSmart.get("/fitness/google/today");
  return res.data;
}
