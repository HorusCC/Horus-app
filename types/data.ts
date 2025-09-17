interface RefeicoesProps {
  horario: string;
  nome: string;
  alimentos: string[];
}

export interface Data {
  nome: string;
  email: string;
  idade: number;
  altura: number;
  peso: number;
  sexo: string;
  objetivo: number;
  refeicoes: RefeicoesProps[];
  suplementos: string[];
}
