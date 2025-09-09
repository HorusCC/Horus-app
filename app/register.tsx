import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

type FormData = z.infer<typeof schema>;

const sexoValues = ["masculino", "feminino"] as const;
const atividadeValues = ["sedentario", "leve", "moderado", "ativo"] as const;
const objetivoValues = ["emagrecimento", "manutencao", "ganho_massa"] as const;

const schema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .max(100),
  idade: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Idade deve ser um número positivo",
  }),
  altura: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Altura deve ser um número positivo",
  }),
  peso: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Peso deve ser um número positivo",
  }),
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
  const { colors, theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

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
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/horusNew.png")}
      />
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>
        Preencha os dados abaixo para continuar
      </Text>

      <Text style={styles.label}>Nome</Text>
      <Input
        name="nome"
        style={styles.tableText}
        control={control}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <Text style={styles.label}>Email</Text>
      <Input
        name="email"
        control={control}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Senha</Text>
      <Input
        name="senha"
        control={control}
        placeholder="Senha"
        value={senha}
        secureTextEntry
        onChangeText={setSenha}
      />
      <Text style={styles.label}>Idade</Text>
      <Input
        name="idade"
        control={control}
        placeholder="Idade"
        value={idade}
        keyboardType="numeric"
        onChangeText={setIdade}
      />
      <Text style={styles.label}>Altura</Text>
      <Input
        style={[styles.resultText, { marginBottom: 20 }]}
        name="altura"
        control={control}
        placeholder="Altura (cm)"
        value={altura}
        keyboardType="numeric"
        onChangeText={setAltura}
      />
      <Text style={styles.label}>Peso</Text>
      <Input
        name="peso"
        control={control}
        placeholder="Peso (kg)"
        value={peso}
        keyboardType="numeric"
        onChangeText={setPeso}
      />

      <Text style={styles.label}>Sexo</Text>
      <Select
        selectedValue={sexo}
        onValueChange={setSexo}
        options={[
          { label: "Masculino", value: "masculino" },
          { label: "Feminino", value: "feminino" },
        ]}
      />

      <Text style={styles.label}>Atividade Física</Text>
      <Select
        selectedValue={atividade}
        onValueChange={setAtividade}
        options={[
          { label: "Sedentário", value: "sedentario" },
          { label: "Levemente ativo", value: "leve" },
          { label: "Moderadamente ativo", value: "moderado" },
          { label: "Muito ativo", value: "ativo" },
        ]}
      />

      <Text style={styles.label}>Objetivo</Text>
      <Select
        selectedValue={objetivo}
        onValueChange={setObjetivo}
        options={[
          { label: "Emagrecimento", value: "emagrecimento" },
          { label: "Manutenção", value: "manutencao" },
          { label: "Ganho de massa muscular", value: "ganho_massa" },
        ]}
      />

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>IMC: {resultado.imc.toFixed(2)}</Text>
          <Text style={styles.resultText}>
            TMB: {resultado.tmb.toFixed(2)} kcal/dia
          </Text>
          <Text style={styles.resultText}>
            Classificação: {resultado.classificacao}
          </Text>

          <View style={styles.table}>
            <Text style={styles.tableTitle}>Classificação IMC</Text>
            <Text style={styles.tableText}>• Magreza: abaixo de 18.5</Text>
            <Text style={styles.tableText}>• Normal: entre 18.5 e 24.9</Text>
            <Text style={styles.tableText}>• Sobrepeso: entre 25.0 e 29.9</Text>
            <Text style={styles.tableText}>• Obesidade: acima de 30.0</Text>
          </View>
        </View>
      )}

      <Button
        title="Cadastrar"
        onPress={() => router.push("/(tabs)/home")}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#00060E",
    flexGrow: 1,
  },
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
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "rgba(0, 87, 201, 0.15)",
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
  },
  tableTitle: {
    fontWeight: "700",
    color: "#5692B7",
    marginBottom: 5,
  },
  tableText: {
    color: "#ccc",
  },
  label: {
    marginBottom: 10,
    color: "#ffffffff",
  },
});
