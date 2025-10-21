import axios from "axios";

const BASE = "http://26.38.143.141:8080/ai";

export const api = axios.create({
  baseURL: BASE,
  timeout: 40000,
});
