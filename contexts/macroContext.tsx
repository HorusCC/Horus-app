import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  calcMacroTargets,
  sumConsumed,
  remainingForToday,
  type UserProfile,
  type MacroTargets,
  type LoggedFood,
} from "@/src/utils/nutrition";

// ✅ Tipagem do contexto
type MacroContextType = {
  profile?: UserProfile;
  targets?: MacroTargets;
  foodsToday: LoggedFood[];
  consumed: ReturnType<typeof sumConsumed>;
  remaining?: MacroTargets;
  setProfile: (profile: UserProfile) => void;
  addFood: (food: LoggedFood) => void;
  removeFood: (id: string) => void;
  resetDay: () => void;
};

const MacroContext = createContext<MacroContextType | undefined>(undefined);
const STORAGE_KEY = "macroData@v1";

export function MacroProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>();
  const [targets, setTargets] = useState<MacroTargets>();
  const [foodsToday, setFoodsToday] = useState<LoggedFood[]>([]);

  // 🧠 Carrega dados salvos no AsyncStorage ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          setProfileState(parsed.profile);
          setTargets(parsed.targets);
          setFoodsToday(parsed.foodsToday || []);
        }
      } catch (error) {
        console.log("❌ Erro ao carregar dados:", error);
      }
    })();
  }, []);

  // 💾 Salva automaticamente sempre que algo mudar
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ profile, targets, foodsToday })
        );
      } catch (error) {
        console.log("❌ Erro ao salvar dados:", error);
      }
    })();
  }, [profile, targets, foodsToday]);

  // 👤 Define o perfil e calcula metas de macros
  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    setTargets(calcMacroTargets(p));
  };

  // ➕ Adiciona alimento consumido
  const addFood = (food: LoggedFood) => {
    setFoodsToday((prev) => [food, ...prev]);
  };

  // ❌ Remove alimento consumido
  const removeFood = (id: string) => {
    setFoodsToday((prev) => prev.filter((f) => f.id !== id));
  };

  // 🔁 Reinicia o dia
  const resetDay = () => {
    setFoodsToday([]);
  };

  // 📊 Calcula automaticamente o total consumido e o restante
  const consumed = useMemo(() => sumConsumed(foodsToday), [foodsToday]);
  const remaining = useMemo(
    () => (targets ? remainingForToday(targets, consumed) : undefined),
    [targets, consumed]
  );

  return (
    <MacroContext.Provider
      value={{
        profile,
        targets,
        foodsToday,
        consumed,
        remaining,
        setProfile,
        addFood,
        removeFood,
        resetDay,
      }}
    >
      {children}
    </MacroContext.Provider>
  );
}

// ✅ Hook para usar em qualquer tela
export function useMacro() {
  const context = useContext(MacroContext);
  if (!context) {
    throw new Error("useMacro deve ser usado dentro de <MacroProvider>");
  }
  return context;
}
