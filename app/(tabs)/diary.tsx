// app/(tabs)/DietDiary.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { useMacros } from "../contexts/MacroContext";

// Banco de alimentos com macros por 100g
const foodDatabase = {
  "Ovos mexidos": { carb: 1.1, protein: 13, fat: 11 },
  "Pão integral": { carb: 49, protein: 9, fat: 3.5 },
  "Fruta": { carb: 14, protein: 0.5, fat: 0.2 },
  "Iogurte": { carb: 5, protein: 3.5, fat: 3 },
  "Mix de castanhas": { carb: 22, protein: 20, fat: 50 },
  "Arroz integral": { carb: 23, protein: 2.6, fat: 0.9 },
  "Frango grelhado": { carb: 0, protein: 31, fat: 3.6 },
  "Salada": { carb: 3, protein: 1, fat: 0.2 },
  "Sanduíche natural": { carb: 30, protein: 12, fat: 5 },
  "Suco natural": { carb: 12, protein: 0.5, fat: 0 },
  "Peixe grelhado": { carb: 0, protein: 20, fat: 2 },
  "Batata doce": { carb: 20, protein: 1.6, fat: 0.1 },
  "Legumes": { carb: 5, protein: 2, fat: 0.2 },
};

interface DiaryItem {
  name: string;
  grams: number;
}

export default function DietDiary() {
  const [mealName, setMealName] = useState("");
  const [grams, setGrams] = useState("");
  const [diary, setDiary] = useState<DiaryItem[]>([]);
  const { addMacros, resetMacros } = useMacros();

  const addMeal = () => {
    if (!mealName.trim() || !grams) return;

    const foodKey = mealName as keyof typeof foodDatabase;
    const food = foodDatabase[foodKey];
    const gramsValue = parseFloat(grams);

    if (!food) {
      alert("Alimento não encontrado no banco de dados");
      return;
    }

    const factor = gramsValue / 100; // calcula macros proporcional à quantidade
    addMacros(food.carb * factor, food.protein * factor, food.fat * factor);

    setDiary([{ name: mealName, grams: gramsValue }, ...diary]);
    setMealName("");
    setGrams("");
  };

  const removeMeal = (index: number) => {
    const item = diary[index];
    const foodKey = item.name as keyof typeof foodDatabase;
    const food = foodDatabase[foodKey];
    const factor = item.grams / 100;

    if (food) {
      // Remove os macros correspondentes
      addMacros(-food.carb * factor, -food.protein * factor, -food.fat * factor);
    }

    const newDiary = [...diary];
    newDiary.splice(index, 1);
    setDiary(newDiary);
  };

  return (
    <View style={styles.containerOuter}>
      <Text style={styles.title}>Diário de Alimentação</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nome do alimento"
          placeholderTextColor="#aaa"
          value={mealName}
          onChangeText={setMealName}
          style={styles.input}
        />
        <TextInput
          placeholder="Gramas"
          placeholderTextColor="#aaa"
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
          style={[styles.input, { width: 80 }]}
        />
        <TouchableOpacity onPress={addMeal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={diary}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.diaryItem}>
            <Text style={styles.diaryText}>• {item.name} ({item.grams}g)</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMeal(index)}
            >
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", alignSelf: "center", marginBottom: 20, marginTop: 40 },

  inputContainer: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#36A2EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    height: 50,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },

  diaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  diaryText: { color: "#fff", fontSize: 14, flex: 1 },

  removeButton: {
    backgroundColor: "#FF4C4C",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  removeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  logo: {
    position: "absolute",
    top: 30,
    right: 320,
    width: 64,
    height: 64,
    resizeMode: "contain",
    opacity: 0.98,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
