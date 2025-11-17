// src/contexts/macroContext.tsx
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

// --------------------------
// Tipos do contexto
// --------------------------
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

// --------------------------
// Chaves de armazenamento
// --------------------------
// Agora STORAGE_KEY guarda um MAPA por usuário:
// { [userKey]: { profile, targets, foodsToday } }
const STORAGE_KEY = "macroDataByUser@v2";
const AUTH_USER_KEY = "@auth_user"; // onde você já salva o usuário do backend

// --------------------------
// Helpers de mapeamento (back->app)
// --------------------------
function mapLevelToAtividade(v?: string): UserProfile["atividade"] {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("levemente") || s === "leve") return "leve";
  if (s.includes("moderado") || s.includes("consideravel")) return "moderado";
  if (s.includes("ativo_com_frequencia") || s.includes("muito")) return "ativo";
  return "sedentario";
}
function mapObjectiveToObjetivo(v?: string): UserProfile["objetivo"] {
  const s = String(v ?? "").toLowerCase();
  if (s.startsWith("emagre")) return "emagrecimento";
  if (s.includes("ganh")) return "ganho_massa";
  return "manutencao";
}
function normGender(v?: string): UserProfile["sexo"] {
  const s = String(v ?? "").toLowerCase();
  if (s.startsWith("fem")) return "feminino";
  return "masculino";
}
function toNum(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v ?? "")
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Extrai um UserProfile do objeto salvo no login
function profileFromAuthUser(authUser: any | null): UserProfile | undefined {
  if (!authUser) return undefined;

  // aceitamos tanto pt-BR quanto en-US
  const idade = toNum(authUser.idade ?? authUser.age);
  const altura = toNum(authUser.altura ?? authUser.height);
  const peso = toNum(authUser.peso ?? authUser.weight);
  const sexo = normGender(authUser.sexo ?? authUser.gender);
  const atividade = mapLevelToAtividade(authUser.atividade ?? authUser.level);
  const objetivo = mapObjectiveToObjetivo(
    authUser.objetivo ?? authUser.objective
  );

  // precisa ter números válidos pra calcular
  if (!idade || !altura || !peso) return undefined;

  return { idade, altura, peso, sexo, atividade, objetivo };
}

// --------------------------
// Provider
// --------------------------
type SavedUserMacroData = {
  profile?: UserProfile;
  targets?: MacroTargets;
  foodsToday: LoggedFood[];
};
type SavedMacroMap = Record<string, SavedUserMacroData>;

export function MacroProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>();
  const [targets, setTargets] = useState<MacroTargets>();
  const [foodsToday, setFoodsToday] = useState<LoggedFood[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);

  // Carrega estado salvo por usuário
  useEffect(() => {
    (async () => {
      try {
        // 1) lê mapa salvo
        const savedStr = await AsyncStorage.getItem(STORAGE_KEY);
        let savedMap: SavedMacroMap = {};
        if (savedStr) {
          try {
            const parsed = JSON.parse(savedStr);
            // se for formato antigo (um único objeto), ignora e começa novo
            if (
              parsed &&
              typeof parsed === "object" &&
              !Array.isArray(parsed)
            ) {
              if (
                "profile" in parsed ||
                "targets" in parsed ||
                "foodsToday" in parsed
              ) {
                // formato antigo, joga fora ou migra se quiser
                savedMap = {};
              } else {
                savedMap = parsed as SavedMacroMap;
              }
            }
          } catch {
            savedMap = {};
          }
        }

        // 2) pega usuário logado do AsyncStorage (@auth_user)
        const authStr = await AsyncStorage.getItem(AUTH_USER_KEY);
        const auth = authStr ? JSON.parse(authStr) : null;
        const newKey: string =
          auth?.id ?? auth?._id ?? auth?.email ?? auth?.user?.email ?? "anon";

        setUserKey(newKey);

        // 3) tenta carregar dados daquele usuário
        let userData = savedMap[newKey];

        // se não existir, monta a partir do cadastro
        if (!userData) {
          const p = profileFromAuthUser(auth);
          let t: MacroTargets | undefined;
          if (p) {
            t = calcMacroTargets(p);
          }
          userData = {
            profile: p,
            targets: t,
            foodsToday: [],
          };
          savedMap[newKey] = userData;
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));
        }

        setProfileState(userData.profile);
        if (userData.targets) setTargets(userData.targets);
        setFoodsToday(
          Array.isArray(userData.foodsToday) ? userData.foodsToday : []
        );
      } catch (e) {
        console.log("❌ macroContext init error:", e);
      }
    })();
  }, []);

  // Persiste sempre que mudar algo para o usuário atual
  useEffect(() => {
    if (!userKey) return;
    (async () => {
      try {
        const savedStr = await AsyncStorage.getItem(STORAGE_KEY);
        let savedMap: SavedMacroMap = {};
        if (savedStr) {
          try {
            const parsed = JSON.parse(savedStr);
            if (
              parsed &&
              typeof parsed === "object" &&
              !Array.isArray(parsed)
            ) {
              savedMap = parsed as SavedMacroMap;
            }
          } catch {
            savedMap = {};
          }
        }

        savedMap[userKey] = {
          profile,
          targets,
          foodsToday,
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));
      } catch (e) {
        console.log("❌ macroContext save error:", e);
      }
    })();
  }, [profile, targets, foodsToday, userKey]);

  // API do contexto
  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    setTargets(calcMacroTargets(p));
  };
  const addFood = (food: LoggedFood) =>
    setFoodsToday((prev) => [food, ...prev]);
  const removeFood = (id: string) =>
    setFoodsToday((prev) => prev.filter((f) => f.id !== id));
  const resetDay = () => setFoodsToday([]);

  // Derivados
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

export function useMacro() {
  const ctx = useContext(MacroContext);
  if (!ctx)
    throw new Error("useMacro deve ser usado dentro de <MacroProvider>");
  return ctx;
}
