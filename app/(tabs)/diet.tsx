// app/(tabs)/GenerateDiet.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const meals = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Café da Tarde", "Jantar"];

const foodDatabase: Record<string, { carb: number; protein: number; fat: number }> = {
  // Café da manhã
  "Pão": { carb: 49, protein: 9, fat: 3.2 },
  "Ovo": { carb: 1, protein: 13, fat: 11 },
  "Leite": { carb: 5, protein: 3.4, fat: 3.3 },
  "Aveia": { carb: 66, protein: 17, fat: 7 },
  "Banana": { carb: 23, protein: 1.1, fat: 0.3 },
  "Maçã": { carb: 14, protein: 0.3, fat: 0.2 },
  "Iogurte": { carb: 6, protein: 3.5, fat: 3 },
  // Lanche da manhã
  "Castanha": { carb: 14, protein: 20, fat: 50 },
  "Barra de Cereal": { carb: 65, protein: 7, fat: 10 },
  "Suco de Laranja": { carb: 10, protein: 0.7, fat: 0.2 },
  // Almoço
  "Arroz": { carb: 28, protein: 2.5, fat: 0.3 },
  "Feijão": { carb: 14, protein: 9, fat: 0.5 },
  "Frango": { carb: 0, protein: 27, fat: 3.6 },
  "Peixe": { carb: 0, protein: 20, fat: 5 },
  "Salada": { carb: 3, protein: 1, fat: 0 },
  "Legumes": { carb: 7, protein: 2, fat: 0.1 },
  // Café da tarde
  "Pão Integral": { carb: 48, protein: 9, fat: 3 },
  "Queijo": { carb: 1.3, protein: 25, fat: 33 },
  // Jantar
  "Arroz Integral": { carb: 23, protein: 2.6, fat: 1.5 },
  "Frango Grelhado": { carb: 0, protein: 27, fat: 3 },
  "Salada Jantar": { carb: 2, protein: 1, fat: 0 },
  // Extras experimentais
  "Quinoa": { carb: 21, protein: 4.1, fat: 1.9 },
  "Batata Doce": { carb: 20, protein: 1.6, fat: 0.1 },
  "Cenoura": { carb: 10, protein: 0.9, fat: 0.2 },
  "Tomate": { carb: 4, protein: 0.9, fat: 0.2 },
  "Abacate": { carb: 9, protein: 2, fat: 15 },
  "Peito de Peru": { carb: 0, protein: 29, fat: 1 },
};

const mealFoodOptions: Record<string, string[]> = {
  "Café da Manhã": ["Pão", "Ovo", "Leite", "Aveia", "Banana", "Maçã", "Iogurte"],
  "Lanche da Manhã": ["Fruta", "Iogurte", "Barra de Cereal", "Castanha", "Suco de Laranja", "Abacate"],
  "Almoço": ["Arroz", "Feijão", "Frango", "Peixe", "Salada", "Legumes", "Batata Doce", "Quinoa", "Cenoura", "Tomate"],
  "Café da Tarde": ["Pão Integral", "Queijo", "Iogurte", "Fruta", "Barra de Cereal"],
  "Jantar": ["Arroz Integral", "Frango Grelhado", "Peixe", "Legumes", "Salada Jantar", "Quinoa", "Cenoura", "Tomate", "Peito de Peru"],
};

const generateMealItems = (meal: string) => {
  const options = mealFoodOptions[meal];
  const count = Math.min(3, options.length); // pegar até 3 alimentos
  let items: string[] = [];
  while (items.length < count) {
    const randomFood = options[Math.floor(Math.random() * options.length)];
    if (!items.includes(randomFood)) items.push(randomFood);
  }
  return items.join(", ");
};

export default function GenerateDiet() {
  const [generatedMeals, setGeneratedMeals] = useState<Array<{ name: string; items: string }>>([]);

  const handleGenerateDiet = () => {
    const diet = meals.map((meal) => ({
      name: meal,
      items: generateMealItems(meal),
    }));
    setGeneratedMeals(diet);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
      <Text style={styles.title}>Gerar Dieta</Text>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateDiet}>
        <Ionicons name="restaurant-outline" size={24} color="#fff" />
        <Text style={styles.generateButtonText}>Gerar Dieta</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {generatedMeals.map((meal) => (
          <View key={meal.name} style={styles.mealCard}>
            <Text style={styles.mealTitle}>{meal.name}</Text>
            <Text style={styles.mealItems}>{meal.items}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 60 },
  logo: { width: 60, height: 60, resizeMode: "contain", position: "absolute", top: 40, left: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#0057C9", marginBottom: 20 },
  generateButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth:1,
    borderColor: "#0057C9",
  },
  generateButtonText: { color: "#0057C9", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  mealCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  mealTitle: { color: "#36A2EB", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  mealItems: { color: "#fff", fontSize: 14 },
});
