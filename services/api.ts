import axios from "axios";
import { Platform } from "react-native";

const DEV_HOST =
  Platform.OS === "android"
    ? "http://192.168.15.2:8080"
    : "http://localhost:8080";

const PROD_HOST = DEV_HOST;

// Alterna automaticamente conforme ambiente:
const HOST = __DEV__ ? DEV_HOST : PROD_HOST;

export const apiApp = axios.create({
  baseURL: `${HOST}/api`,
  timeout: 20000,
});

export const apiIA = axios.create({
  baseURL: `${HOST}/ai`,
  timeout: 40000,
});
