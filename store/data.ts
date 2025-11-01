import { create } from "zustand";

export type User = {
  nome: string;
  email: string;
  senha: string;
  idade: string;
  altura: string;
  peso: string;
  sexo: string;
  atividade: string;
  objetivo: string;
};

type DataState = {
  user: User;
  setPageOne: (data: Pick<User, "email" | "senha">) => void;
  setPageTwo: (data: Partial<User>) => void; // <-- aqui
};

export const useDataStore = create<DataState>((set) => ({
  user: {
    nome: "",
    email: "",
    senha: "",
    idade: "",
    altura: "",
    peso: "",
    sexo: "",
    atividade: "",
    objetivo: "",
  },
  setPageOne: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  setPageTwo: (data) => set((state) => ({ user: { ...state.user, ...data } })),
}));
