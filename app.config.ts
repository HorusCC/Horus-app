// app.config.ts
import { ExpoConfig, ConfigContext } from "expo/config";

// declaração simples pra evitar erro de TS com process.env
declare const process: {
  env: {
    APP_ENV?: string;
    [key: string]: string | undefined;
  };
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const isDev = (process.env.APP_ENV ?? "development") !== "production";

  // 👇 Monta config android à parte e força como any
  const androidConfig: any = {
    ...(config.android ?? {}),
    // necessário por causa da lib androidx.health.connect
    minSdkVersion: 26,
    permissions: [
      ...(config.android?.permissions ?? []),
      "android.permission.health.READ_STEPS",
      "android.permission.health.READ_TOTAL_CALORIES_BURNED",
    ],
  };

  return {
    ...config,

    name: "SeuApp",
    slug: "SeuApp",

    extra: {
      ...(config.extra ?? {}),
      apiBaseUrl: isDev
        ? "http://192.168.15.3:8080/api"
        : "https://backendtcc-iikl.onrender.com/api",

      apiAIBaseUrl: isDev
        ? "http://192.168.15.3:8080/ai"
        : "https://backendtcc-iikl.onrender.com/ai",

      APP_ENV: isDev ? "development" : "production",
    },

    // aqui usamos a config android que montamos acima
    android: androidConfig,
  };
};
