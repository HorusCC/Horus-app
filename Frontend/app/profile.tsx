// app/(tabs)/profile.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useDataStore } from "@/store/data";
import { useQuery } from "@tanstack/react-query";
import { Data } from "../types/data";
import { api } from "../services/api";
interface ResponseData {
  data: Data;
}

const toNumber = (v?: string) =>
  Number(
    String(v ?? "")
      .replace(/[^\d.,-]/g, "")
      .replace(",", ".")
  );

const calcIMC = (pesoKg: number, alturaCm: number) => {
  if (!pesoKg || !alturaCm) return null;
  const alturaM = alturaCm >= 3 ? alturaCm / 100 : alturaCm;
  return pesoKg / (alturaM * alturaM);
};

const classifyIMC = (imc?: number) => {
  if (imc == null || !isFinite(imc)) return { label: "--", color: "#9CA3AF" };
  if (imc < 18.5) return { label: "Abaixo do peso", color: "#F59E0B" };
  if (imc < 25) return { label: "Peso normal", color: "#10B981" };
  if (imc < 30) return { label: "Sobrepeso", color: "#F97316" };
  if (imc < 35) return { label: "Obesidade I", color: "#EF4444" };
  if (imc < 40) return { label: "Obesidade II", color: "#DC2626" };
  return { label: "Obesidade III", color: "#991B1B" };
};

const calcTMB = (
  sexo: string,
  pesoKg: number,
  alturaCm: number,
  idade: number
) => {
  if (!pesoKg || !alturaCm || !idade) return null;
  return sexo?.toLowerCase() === "masculino"
    ? 88.36 + 13.4 * pesoKg + 4.8 * alturaCm - 5.7 * idade
    : 447.6 + 9.2 * pesoKg + 3.1 * alturaCm - 4.3 * idade;
};

export default function ProfileScreen() {
  const user = useDataStore((state) => state.user);

  const pesoKg = toNumber(user.peso);
  const alturaCm = toNumber(user.altura);
  const idadeNum = toNumber(user.idade);

  const imc = calcIMC(pesoKg, alturaCm);
  const imcClass = classifyIMC(imc ?? undefined);
  const tmb = calcTMB(user.sexo, pesoKg, alturaCm, idadeNum);

  const {} = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error("Filed load profile");
        }

        const response = await api.post<ResponseData>("/profile", {
          name: user.nome,
          email: user.email,
          password: user.senha,
          age: user.idade,
          weight: user.peso,
          height: user.altura,
          gender: user.sexo,
          level: user.atividade,
          objective: user.objetivo,
        });

        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header com logo + título */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/horusNew.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.subtitle}>Informações Pessoais</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user.nome}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.valueStatic}>{user.sexo}</Text>
          </View>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.subtitle}>Dados Corporais</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Idade:</Text>
            <Text style={styles.value}>{user.idade} anos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Peso:</Text>
            <Text style={styles.value}>{user.peso} kg's</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Altura:</Text>
            <Text style={styles.value}>{user.altura} cm's</Text>
          </View>

          <View style={styles.cardStatic}>
            <Text style={styles.label}>IMC:</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.valueStatic}>
                {imc !== null ? imc.toFixed(2) : "--"}
              </Text>
              <Text
                style={{
                  color: imcClass.color,
                  fontWeight: "700",
                  fontSize: 20,
                  marginHorizontal: 8,
                }}
              >
                ({imcClass.label})
              </Text>
            </View>
          </View>

          <View style={styles.cardStatic}>
            <Text style={styles.label}>TMB:</Text>
            <Text style={styles.valueStatic}>
              {tmb !== null ? `${tmb.toFixed(2)} kcal/dia` : "--"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 25,
    left: 5,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: "bold",
    color: "#0057C9",
    marginTop: 40,
    textAlign: "center",
  },
  profileBox: {
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5692B7",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardStatic: {
    backgroundColor: "#555555ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    color: "#5692B7",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  valueStatic: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
