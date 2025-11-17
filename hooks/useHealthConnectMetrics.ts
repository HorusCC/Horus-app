// hooks/useHealthConnectMetrics.ts
import { useEffect, useState, useCallback } from "react";
import { Platform, NativeModules } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

type HealthConnectMetrics = {
  steps: number;
  calories: number;
};

export function useHealthConnectMetrics() {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodayData = useCallback(async () => {
    // 1) Garantir que é Android
    if (Platform.OS !== "android") {
      setError("Health Connect está disponível apenas no Android.");
      return;
    }

    // 2) Checar se o módulo nativo existe
    const nativeModule =
      (NativeModules as any).HealthConnectModule ||
      (NativeModules as any).HealthConnect;

    if (!nativeModule) {
      setError(
        "Health Connect não está disponível neste dispositivo ou módulo não carregou."
      );
      return;
    }

    // 3) Opcional: checar versão mínima de Android (API 26+)
    const apiLevel =
      typeof Platform.Version === "number"
        ? Platform.Version
        : parseInt(Platform.Version as string, 10);

    if (!Number.isNaN(apiLevel) && apiLevel < 26) {
      setError("Health Connect requer Android 8.0 (API 26) ou superior.");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // PROTEGIDO CONTRA CRASH
      let isInitialized = false;
      try {
        isInitialized = await initialize();
      } catch (e) {
        console.log("[HC] initialize crash:", e);
        setError("Health Connect não está instalado.");
        return;
      }

      if (!isInitialized) {
        setError("Falha ao inicializar o Health Connect.");
        return;
      }

      // 5) Pede permissões
      try {
        await requestPermission([
          { accessType: "read", recordType: "Steps" },
          { accessType: "read", recordType: "TotalCaloriesBurned" },
        ]);
      } catch (e) {
        console.log("[HealthConnect] requestPermission() crash:", e);
        setError("Não é possível pedir permissão ao Health Connect.");
        return;
      }

      // 6) Intervalo de hoje (00:00 até agora)
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      const startTime = startOfDay.toISOString();
      const endTime = now.toISOString();

      // 7) Ler passos
      const stepResponse = await readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime,
          endTime,
        },
      }).catch((e) => {
        console.log("[HealthConnect] Erro em readRecords(Steps):", e);
        throw e;
      });

      const stepRecords = stepResponse.records ?? [];
      const totalSteps = stepRecords.reduce(
        (sum: number, rec: any) => sum + (rec.count ?? 0),
        0
      );

      // 8) Ler calorias
      const calResponse = await readRecords("TotalCaloriesBurned", {
        timeRangeFilter: {
          operator: "between",
          startTime,
          endTime,
        },
      }).catch((e) => {
        console.log(
          "[HealthConnect] Erro em readRecords(TotalCaloriesBurned):",
          e
        );
        throw e;
      });

      const calorieRecords = calResponse.records ?? [];
      const totalCalories = calorieRecords.reduce(
        (sum: number, rec: any) =>
          sum + (rec.energy?.inKilocalories ?? rec.energy?.inCalories ?? 0),
        0
      );

      setSteps(Math.round(totalSteps));
      setCalories(Math.round(totalCalories));
    } catch (e: any) {
      console.error("[HealthConnect] Erro geral:", e);
      setError(
        e?.message ?? "Não foi possível ler os dados do Health Connect."
      );
      setSteps(0);
      setCalories(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  return {
    steps,
    calories,
    loading,
    error,
    refresh: loadTodayData,
  } as HealthConnectMetrics & {
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
  };
}
