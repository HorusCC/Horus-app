// app/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
} from "react-native";
import { useDataStore } from "@/store/data";
import { useQuery } from "@tanstack/react-query";
import { Data } from "../types/data";
import { apiApp } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { TextInput, ActivityIndicator } from "react-native";
interface ResponseData {
  data: Data;
}

// type EditableFieldProps = {
//   label: string;
//   value: string | number | null | undefined;
//   suffix?: string;
//   keyboardType?: "default" | "numeric";
//   userId: string;
//   payloadKey: "age" | "weight" | "height" | "name";
//   parse?: (v: string) => any;
//   onLocalUpdate: (next: any) => void;
// };

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
  const setPageTwo = useDataStore((s) => s.setPageTwo);

  const pesoKg = toNumber(user.peso);
  const alturaCm = toNumber(user.altura);
  const idadeNum = toNumber(user.idade);

  const imc = calcIMC(pesoKg, alturaCm);
  const imcClass = classifyIMC(imc ?? undefined);
  const tmb = calcTMB(user.sexo, pesoKg, alturaCm, idadeNum);

  const { data } = useQuery({
    queryKey: ["profile", user.email],
    enabled: !!user.email,
    queryFn: async () => {
      const res = await apiApp.get("/users");
      const found = res.data.find(
        (u: any) => u.email?.toLowerCase() === user.email?.toLowerCase()
      );
      return found ?? null;
    },
  });

  useEffect(() => {
    if (!data) return;
    const u: any = data;
    setPageTwo({
      nome: u.name ?? "",
      email: u.email ?? user.email,
      senha: "",
      idade: String(u.age ?? ""),
      altura: String(u.height ?? ""),
      peso: String(u.weight ?? ""),
      sexo: u.gender ?? "",
      atividade: u.level ?? "",
      objetivo: u.objective ?? "",
    });
  }, [data, setPageTwo, user.email]);

  const userId = (data as any)?._id as string | undefined;

  function EditableField({
    label,
    value,
    unit,
    payloadKey,
  }: {
    label: string;
    value: string;
    unit?: string;
    payloadKey: "age" | "weight" | "height";
  }) {
    const [editing, setEditing] = React.useState(false);
    const [local, setLocal] = React.useState(value);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => setLocal(value), [value]);

    async function save() {
      if (!userId) return;
      const num = Number(
        String(local)
          .replace(/[^\d.,-]/g, "")
          .replace(",", ".")
      );
      setLoading(true);
      try {
        await apiApp.patch(`/users/${userId}`, { [payloadKey]: num });
        if (payloadKey === "age") setPageTwo({ idade: String(num) });
        if (payloadKey === "weight") setPageTwo({ peso: String(num) });
        if (payloadKey === "height") setPageTwo({ altura: String(num) });
        setEditing(false);
      } catch (e) {
        console.log("PATCH failed:", e);
      } finally {
        setLoading(false);
      }
    }

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {!editing ? (
            <Pressable
              accessibilityLabel="Editar"
              onPress={() => setEditing(true)}
            >
              <MaterialIcons name="edit" size={21} color="#5692B7" />
            </Pressable>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {loading && <ActivityIndicator />}
              <Pressable
                onPress={() => {
                  setLocal(value);
                  setEditing(false);
                }}
              >
                <Text style={{ color: "#9CA3AF" }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={save}>
                <Text style={{ color: "#5692B7", fontWeight: "700" }}>
                  Salvar
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {!editing ? (
          <Text>
            {value} {unit}
          </Text>
        ) : (
          <TextInput
            value={local}
            onChangeText={setLocal}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#5692B7",
              borderRadius: 8,
              color: "#fff",
              fontSize: 18,
            }}
          />
        )}
      </View>
    );
  }

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

          <View style={styles.cardStatic}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user.nome}</Text>
          </View>

          <View style={styles.cardStatic}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.valueStatic}>{user.sexo}</Text>
          </View>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.subtitle}>Dados Corporais</Text>

          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.label}>Idade:</Text>
              <EditableField label="Idade" payloadKey="age" />
            </View>
            <Text style={styles.value}>{user.idade} anos</Text>
          </View>

          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.label}>Peso:</Text>
              <EditableField label="Peso" payloadKey="weight" />
            </View>
            <Text style={styles.value}>{user.peso} kg's</Text>
          </View>

          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.label}>Altura:</Text>
              <EditableField label="Altura" payloadKey="height" />
            </View>
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
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
  },
  valueStatic: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    marginRight: 4,
  },
});
