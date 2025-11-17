// hooks/useHealthConnectMetrics.ts
import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
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
    if (Platform.OS !== "android") {
      setError("Health Connect está disponível apenas no Android.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1) Inicializa Health Connect
      const isInitialized = await initialize();
      if (!isInitialized) {
        setError("Não foi possível inicializar o Health Connect.");
        return;
      }

      // 2) Pede permissões para Steps e TotalCaloriesBurned
      await requestPermission([
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "TotalCaloriesBurned" },
      ]);

      // 3) Intervalo: hoje (00:00 até agora)
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

      // 4) Lê registros de Steps
      const { records: stepRecords } = await readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime,
          endTime,
        },
      });

      const totalSteps = stepRecords.reduce(
        (sum: number, rec: any) => sum + (rec.count ?? 0),
        0
      );

      // 5) Lê registros de TotalCaloriesBurned
      const { records: calorieRecords } = await readRecords(
        "TotalCaloriesBurned",
        {
          timeRangeFilter: {
            operator: "between",
            startTime,
            endTime,
          },
        }
      );

      const totalCalories = calorieRecords.reduce(
        (sum: number, rec: any) =>
          sum + (rec.energy?.inKilocalories ?? rec.energy?.inCalories ?? 0),
        0
      );

      setSteps(Math.round(totalSteps));
      setCalories(Math.round(totalCalories));
    } catch (e: any) {
      console.error("[HealthConnect] Erro ao ler dados:", e);
      setError("Não foi possível ler os dados do Health Connect.");
      setSteps(0);
      setCalories(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // carrega ao abrir a tela
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
