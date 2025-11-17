// hooks/useDailyKcal.ts
import { useState, useEffect, useCallback } from "react";
import { useHealthConnectMetrics } from "./useHealthConnectMetrics";

export function useDailyKcal() {
  // data selecionada (por enquanto, só hoje)
  const [date, setDate] = useState<Date>(new Date());

  // dados de passos e calorias vindos do Health Connect
  const {
    calories,
    steps,
    loading,
    error,
    refresh: refreshHealthConnect,
  } = useHealthConnectMetrics();

  // se no futuro você quiser buscar por outra data,
  // aqui será o lugar pra passar "date" pra lógica.
  const refresh = useCallback(async () => {
    await refreshHealthConnect();
  }, [refreshHealthConnect]);

  // sempre que a data mudar, recarrega (por enquanto recarrega o mesmo dia)
  useEffect(() => {
    refresh();
  }, [refresh, date]);

  return {
    calories,
    steps,
    loading,
    error,
    refresh, // mantém o mesmo nome
    date,
    setDate,
  };
}
