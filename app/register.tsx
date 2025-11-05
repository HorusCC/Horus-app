import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";
import { useDataStore } from "../store/data";
import { apiApp } from "@/services/api"; // ✅ mantém apiApp

const sexoValues = ["masculino", "feminino"] as const;
const atividadeValues = ["sedentario", "leve", "moderado", "ativo"] as const;
const objetivoValues = ["emagrecimento", "manutencao", "ganho_massa"] as const;

const schema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .max(100),
  idade: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 100,
      { message: "Idade deve ser um número positivo" }
    ),
  altura: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 220,
      { message: "Altura deve ser um número positivo" }
    ),
  peso: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 300,
      { message: "Peso deve ser um número positivo" }
    ),
  sexo: z.string().refine((v) => sexoValues.includes(v as any), {
    message: "Selecione o sexo",
  }),
  atividade: z.string().refine((v) => atividadeValues.includes(v as any), {
    message: "Selecione a atividade",
  }),
  objetivo: z.string().refine((v) => objetivoValues.includes(v as any), {
    message: "Selecione o objetivo",
  }),
});

type FormData = z.infer<typeof schema>; // ✅ movido pra depois do schema

const mapLevel = (v: string) => {
  switch (v) {
    case "sedentario":
      return "sedentario";
    case "leve":
      return "levemente_ativo";
    case "moderado":
      return "consideravelmente_ativo";
    case "ativo":
      return "ativo_com_frequencia";
    default:
      return "sedentario";
  }
};

const mapObjective = (v: string) => {
  switch (v) {
    case "emagrecimento":
      return "emagrecer";
    case "manutencao":
      return "manutencao";
    case "ganho_massa":
      return "ganhar_massa";
    default:
      return "manutencao";
  }
};

const toNumber = (s: string) => Number(String(s).replace(",", "."));

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [atividade, setAtividade] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [resultado, setResultado] = useState<{
    imc: number;
    tmb: number;
    classificacao: string;
  } | null>(null);

  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const genderOptions = [
    { label: "Masculino", value: "masculino" },
    { label: "Feminino", value: "feminino" },
  ];

  const setPageTwo = useDataStore((state: any) => state.setPageTwo); // ✅ tipado

  async function handleCreate(data: FormData) {
    setPageTwo({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      idade: data.idade,
      altura: data.altura,
      peso: data.peso,
      sexo: data.sexo,
      atividade: data.atividade,
      objetivo: data.objetivo,
    });

    const payload = {
      name: data.nome.trim(),
      email: data.email.trim(),
      password: String(data.senha),
      age: Number(data.idade),
      height: toNumber(data.altura),
      weight: toNumber(data.peso),
      gender: data.sexo,
      level: mapLevel(data.atividade),
      objective: mapObjective(data.objetivo),
    };

    try {
      await apiApp.post("/users", payload);
      Alert.alert("Cadastro", "Usuário cadastrado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Erro ao registrar";
      console.error("Cadastro falhou:", msg);
      Alert.alert("Cadastro", msg);
    }
  }

  useEffect(() => {
    const alturaM = parseFloat(altura) / 100;
    const pesoKg = parseFloat(peso);
    const idadeNum = parseInt(idade);

    if (
      nome &&
      email &&
      senha &&
      sexo &&
      idade &&
      altura &&
      peso &&
      atividade &&
      !isNaN(alturaM) &&
      !isNaN(pesoKg) &&
      !isNaN(idadeNum)
    ) {
      const imc = pesoKg / (alturaM * alturaM);
      const tmb =
        sexo === "masculino"
          ? 88.36 + 13.4 * pesoKg + 4.8 * parseFloat(altura) - 5.7 * idadeNum
          : 447.6 + 9.2 * pesoKg + 3.1 * parseFloat(altura) - 4.3 * idadeNum;

      let classificacao = "";
      if (imc < 18.5) classificacao = "Magreza";
      else if (imc < 25) classificacao = "Normal";
      else if (imc < 30) classificacao = "Sobrepeso";
      else classificacao = "Obesidade";

      setResultado({ imc, tmb, classificacao });
    } else {
      setResultado(null);
    }
  }, [nome, email, senha, sexo, idade, altura, peso, atividade]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ... resto igual ... */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
        onPress={handleSubmit(handleCreate)}
      >
        <Text style={[styles.button, { color: colors.textButton }]}>
          Registrar-se
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: "#00060E", flexGrow: 1 },
  image: {
    height: 180,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#5692B7",
    marginBottom: 20,
  },
  button: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "rgba(0, 87, 201, 0.15)",
    padding: 15,
    borderRadius: 8,
  },
  resultText: { fontSize: 16, fontWeight: "500", color: "#fff", marginBottom: 5 },
  label: { marginBottom: 5, fontSize: 16, fontWeight: "500" },
  input: {
    width: "auto",
    height: 50,
    borderWidth: 1,
    borderColor: "#0652b4ff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
