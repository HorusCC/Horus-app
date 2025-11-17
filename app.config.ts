import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const isDev = process.env.APP_ENV !== "production";

  return {
    ...config,
    name: "SeuApp",
    slug: "SeuApp",
    extra: {
      apiBaseUrl: isDev
        ? "http://192.168.15.3:8080/api"
        : "https://backendtcc-iikl.onrender.com/api",

      apiAIBaseUrl: isDev
        ? "http://192.168.15.3:8080/ai"
        : "https://backendtcc-iikl.onrender.com/ai",

      APP_ENV: isDev ? "development" : "production",
    },
  };
};
