import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calcMacroTargets,
  sumConsumed,
  remainingForToday,
  type UserProfile,
  type MacroTargets,
  type LoggedFood,
} from 'src/utils/nutrition';

type NutritionCtx = {
  profile?: UserProfile;
  targets?: MacroTargets;
  foodsToday: LoggedFood[];
  consumed: ReturnType<typeof sumConsumed>;
  remaining?: MacroTargets;
  setProfile: (p: UserProfile) => void;
  addFood: (f: LoggedFood) => void;
  removeFood: (id: string) => void;
  resetDay: () => void;
};

const Ctx = createContext<NutritionCtx | undefined>(undefined);
const STORAGE_KEY = 'nutrition@v1';

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | undefined>();
  const [targets, setTargets] = useState<MacroTargets | undefined>();
  const [foodsToday, setFoodsToday] = useState<LoggedFood[]>([]);

  // carregar do storage
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          setProfileState(parsed.profile);
          setTargets(parsed.targets);
          setFoodsToday(parsed.foodsToday ?? []);
        }
      } catch {}
    })();
  }, []);

  // salvar no storage
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, targets, foodsToday })
    ).catch(() => {});
  }, [profile, targets, foodsToday]);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    setTargets(calcMacroTargets(p));
  };

  const addFood = (f: LoggedFood) => setFoodsToday(prev => [f, ...prev]);
  const removeFood = (id: string) => setFoodsToday(prev => prev.filter(i => i.id !== id));
  const resetDay = () => setFoodsToday([]);

  const consumed = useMemo(() => sumConsumed(foodsToday), [foodsToday]);
  const remaining = useMemo(
    () => (targets ? remainingForToday(targets, consumed) : undefined),
    [targets, consumed]
  );

  const value: NutritionCtx = {
    profile,
    targets,
    foodsToday,
    consumed,
    remaining,
    setProfile,
    addFood,
    removeFood,
    resetDay,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNutrition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNutrition must be used inside NutritionProvider');
  return ctx;
}
