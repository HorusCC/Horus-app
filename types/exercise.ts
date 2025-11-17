// types/exercise.ts

export type CardioExercise = {
  id: string;
  name: string;
  type: "cardio";
  minutes: number;
};

export type StrengthExercise = {
  id: string;
  name: string;
  type: "strength";
  sets: number;
  reps: number;
  minutes?: number;
};

export type Exercise = CardioExercise | StrengthExercise;
