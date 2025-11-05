export type ExerciseBase = { id: string; name: string; type: 'cardio' | 'strength' };
export type CardioExercise = ExerciseBase & { type: 'cardio'; minutes: number };
export type StrengthExercise = ExerciseBase & { type: 'strength'; sets: number; reps: number; minutes?: number };
export type Exercise = CardioExercise | StrengthExercise;
