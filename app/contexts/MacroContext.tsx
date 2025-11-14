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

// Chaves de armazenamento
const STORAGE_KEY = "macroData@v1";
const USER_KEY = "macro_user_key@v1"; // identifica o usuário atual no armazenamento

// Helpers de mapeamento (back->app)
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

export function MacroProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>();
  const [targets, setTargets] = useState<MacroTargets>();
  const [foodsToday, setFoodsToday] = useState<LoggedFood[]>([]);

  // Carrega estado salvo + detecta usuário do login
  useEffect(() => {
    (async () => {
      try {
        // 1) lê estado anterior (se houver)
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.profile) setProfileState(parsed.profile);
          if (parsed?.targets) setTargets(parsed.targets);
          if (Array.isArray(parsed?.foodsToday))
            setFoodsToday(parsed.foodsToday);
        }

        // 2) lê usuário logado (@auth_user) e compara
        const authStr = await AsyncStorage.getItem("@auth_user");
        const auth = authStr ? JSON.parse(authStr) : null;
        const newKey =
          auth?.id ?? auth?._id ?? auth?.email ?? auth?.user?.email ?? null;

        const currentKey = await AsyncStorage.getItem(USER_KEY);

        // Se trocou de usuário OU não há targets, recalcula perfil a partir do cadastro
        if (newKey && newKey !== currentKey) {
          const p = profileFromAuthUser(auth);
          if (p) {
            const t = calcMacroTargets(p);
            setProfileState(p);
            setTargets(t);
          }
          // importante: zera os alimentos ao trocar de usuário
          setFoodsToday([]);
          await AsyncStorage.setItem(USER_KEY, String(newKey));
        } else if (!targets) {
          // primeira inicialização: tenta montar perfil dos dados do login
          const p = profileFromAuthUser(auth);
          if (p) {
            const t = calcMacroTargets(p);
            setProfileState(p);
            setTargets(t);
          }
        }
      } catch (e) {
        console.log("❌ macroContext init error:", e);
      }
    })();
  }, []);

  // Persiste sempre que mudar algo
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ profile, targets, foodsToday })
        );
      } catch (e) {
        console.log("❌ macroContext save error:", e);
      }
    })();
  }, [profile, targets, foodsToday]);

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
