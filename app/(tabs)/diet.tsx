// app/(tabs)/GenerateDiet.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDataStore } from "@/store/data";
import { apiIA } from "../../services/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";

type Refeicao = {
  nome: string;
  horario: string;
  alimentos: string[];
};

type DietaResponse = {
  nome: string;
  sexo?: string;
  idade?: number;
  altura?: number;
  peso?: number;
  objetivo: string;
  refeicoes: Refeicao[];
  suplementos: string[];
};

const toNumber = (v?: string) =>
  Number(String(v ?? "").replace(/[^\d.,-]/g, "").replace(",", "."));

const mapObjetivo = (v?: string) => {
  // normaliza valores comuns que você usa no app
  switch ((v || "").toLowerCase()) {
    case "emagrecimento":
    case "emagrecer":
      return "emagrecer";
    case "manutenção":
    case "manutencao":
      return "manutencao";
    case "ganho_massa":
    case "ganhar_massa":
    case "ganho de massa muscular":
      return "ganhar_massa";
    case "engordar":
      return "engordar";
    default:
      return v || "manutencao";
  }
};

export default function GenerateDiet() {
  const user = useDataStore((state) => state.user);
  const { colors } = useTheme();

  const { data, isFetching, error } = useQuery({
    queryKey: ["diet", user?.email],
    enabled: !!user, // só chama se tiver user
    queryFn: async (): Promise<DietaResponse> => {
      if (!user) throw new Error("Usuário não encontrado no estado.");

      const idade = toNumber(user.idade);
      const altura = toNumber(user.altura);
      const peso = toNumber(user.peso);
      const objetivo = mapObjetivo(user.objetivo);

      // payload em PT (o que o backend da IA usa) + espelho em EN (não atrapalha)
      const payload = {
        // ---- PT (principais) ----
        nome: user.nome,
        sexo: user.sexo,
        idade,
        altura,
        peso,
        objetivo,

        // ---- EN (espelho/compatibilidade) ----
        name: user.nome,
        gender: user.sexo,
        age: idade,
        height: altura,
        weight: peso,
        objective: objetivo,

        // extras (se o controller usar)
        level: user.atividade,
        email: user.email,
      };

      const res = await apiIA.post<{ data: DietaResponse }>("/create", payload);
      // o controller devolve { data: ... }
      return res.data.data;
    },
  });

  if (isFetching) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Estamos gerando sua dieta!</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Falha ao gerar Dieta</Text>
        <Link href={"/home"}>
          <Text style={styles.loadingText}>Tente novamente</Text>
        </Link>
        <Ionicons name="close" size={60} color={"red"} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
      <Text style={styles.title}>Dieta</Text>

      <ScrollView style={{ paddingHorizontal: 16 }}>
        {data && Object.keys(data).length > 0 && (
          <>
            <Text style={[styles.name, { color: colors.text }]}>
              Nome: {data.nome}
            </Text>
            <Text style={[styles.objective, { color: colors.text }]}>
              Foco: {data.objetivo}
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>
              Refeições:
            </Text>
            <ScrollView
              style={[styles.foods, { backgroundColor: colors.backgroundDiet }]}
            >
              <View style={styles.foods}>
                {data.refeicoes?.map((refeicao) => (
                  <View
                    style={[
                      styles.food,
                      { backgroundColor: colors.cardItemDiet },
                    ]}
                    key={refeicao.nome + refeicao.horario}
                  >
                    <View style={styles.foodHeader}>
                      <Text
                        style={[
                          styles.foodContentText,
                          { color: colors.text, fontWeight: "bold" },
                        ]}
                      >
                        {refeicao.nome}
                      </Text>
                      <Ionicons name="restaurant" size={22} color={colors.text} />
                    </View>

                    <View style={styles.foodContentRow}>
                      <Feather name="clock" size={20} color={colors.text} />
                      <Text style={[styles.foodContentText, { color: colors.text }]}>
                        Horário: {refeicao.horario}
                      </Text>
                    </View>

                    <Text style={[styles.foodText, { color: colors.text }]}>
                      Alimentos:
                    </Text>
                    {refeicao.alimentos?.map((alimento) => (
                      <Text
                        key={alimento}
                        style={[styles.foodTextItem, { color: colors.text }]}
                      >
                        • {alimento}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>

            <View
              style={[
                styles.foodsSuplement,
                { backgroundColor: colors.backgroundSuplements },
              ]}
            >
              <Text style={[styles.titleSuplement, { color: colors.text }]}>
                Suplementos:
              </Text>
              {data.suplementos?.map((s) => (
                <Text
                  key={s}
                  style={[styles.foodSuplementItems, { color: colors.text }]}
                >
                  • {s}
                </Text>
              ))}
            </View>
          </>
        )}
        <Text />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 50 },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0057C9",
    marginBottom: 20,
  },
  loading: {
    flex: 1,
    backgroundColor: "rgba(180, 180, 180, 1)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 24,
    color: "white",
    marginBottom: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  name: { fontSize: 18, fontWeight: "800" },
  objective: { fontSize: 16, marginBottom: 20 },
  label: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  foods: { paddingHorizontal: 4, paddingVertical: 4, borderRadius: 8, gap: 8 },
  food: { borderRadius: 8, padding: 8 },
  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodContentRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  foodContentText: { fontSize: 16 },
  foodText: { fontSize: 16, marginBottom: 4, marginTop: 10, fontWeight: "bold" },
  foodTextItem: { marginLeft: 4 },
  foodsSuplement: {
    marginTop: 5,
    borderRadius: 8,
    padding: 6,
    borderColor: "#008f0cff",
    borderWidth: 2,
  },
  titleSuplement: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  foodSuplementItems: { fontSize: 16, paddingHorizontal: 4 },
});
