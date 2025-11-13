// app/(tabs)/GenerateDiet.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDataStore } from "@/store/data";
import { apiIA } from "../../services/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { Data } from "../../types/data";
import { Link } from "expo-router";

interface ResponseData {
  data: Data;
}

export default function GenerateDiet() {
  const user = useDataStore((state) => state.user);
  console.log("Dados do usuário na tela de dieta:", user);
  const { colors, theme } = useTheme();

  const { data, isFetching, error } = useQuery({
    queryKey: ["diet"],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error("Filed load diet");
        }

        const response = await apiIA.post<ResponseData>("/create", {
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

        console.log("Resposta da API na tela de dieta:", response.data);

        return response.data.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
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
          <Text style={styles.loading}>Tente novamente</Text>
        </Link>
        <Text>
          <Ionicons name="close" size={60} color={"red"} />
        </Text>
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
                {data.refeicoes.map((refeicao) => (
                  <View
                    style={[
                      styles.food,
                      {
                        backgroundColor: colors.cardItemDiet,
                      },
                    ]}
                    key={refeicao.nome}
                  >
                    <View style={styles.foodHeader}>
                      <Text
                        style={[
                          styles.foodContent,
                          { color: colors.text, fontWeight: "bold" },
                        ]}
                      >
                        {refeicao.nome}
                      </Text>
                      <Ionicons
                        name="restaurant"
                        size={22}
                        color={colors.text}
                      />
                    </View>
                    <View style={styles.foodContent}>
                      <Feather name="clock" size={20} color={colors.text} />
                      <Text
                        style={[styles.foodContent, { color: colors.text }]}
                      >
                        Horário: {refeicao.horario}
                      </Text>
                    </View>
                    <Text style={[styles.foodText, { color: colors.text }]}>
                      Alimentos:
                    </Text>
                    {refeicao.alimentos.map((alimento) => (
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
                Suplementos:{" "}
              </Text>
              {data.suplementos.map((suplementos) => (
                <View key={suplementos}>
                  <Text
                    style={[
                      styles.foodSuplementItems,
                      { color: colors.text, paddingHorizontal: 2 },
                    ]}
                  >
                    •{suplementos};
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
        <Text></Text>
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
  generateButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  generateButtonText: {
    color: "#0057C9",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  mealCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  mealTitle: {
    color: "#36A2EB",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  mealItems: {
    color: "#fff",
    fontSize: 14,
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
    justifyContent: "center",
    fontWeight: "bold",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
  },
  objective: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  foods: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 8,
  },
  food: {
    borderRadius: 8,
    padding: 8,
  },
  foodHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  foodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodText: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
    fontWeight: "bold",
  },
  foodTextItem: {
    marginLeft: 4,
  },
  foodsSuplement: {
    marginTop: 5,
    borderRadius: 8,
    padding: 6,
    borderColor: "#008f0cff",
    borderWidth: 2,
  },
  titleSuplement: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  foodSuplementItems: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
});
