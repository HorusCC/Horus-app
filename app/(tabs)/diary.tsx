// app/(tabs)/DietDiary.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useMacros } from "../contexts/MacroContext";

type FoodEntry = {
  id: string;
  name: string;
  grams: number;
  carb: number;
  protein: number;
  fat: number;
};

// Mini banco de alimentos
const foodDatabase: Record<string, { carb: number; protein: number; fat: number }> = {
  arroz: { carb: 28, protein: 2.5, fat: 0.3 },
  frango: { carb: 0, protein: 27, fat: 3.6 },
  banana: { carb: 23, protein: 1.1, fat: 0.3 },
  batata: { carb: 17, protein: 2, fat: 0.1 },
  ovo: { carb: 1, protein: 13, fat: 11 },
  feijao: { carb: 14, protein: 9, fat: 0.5 },
  pao: { carb: 49, protein: 9, fat: 3.2 },
  pizza: { carb: 33, protein: 11, fat: 10 },
};

export default function DietDiary() {
  const [foodName, setFoodName] = useState("");
  const [grams, setGrams] = useState("");
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const { addMacros, resetMacros } = useMacros();

  const addFood = () => {
    const cleanName = foodName.toLowerCase().replace(/\s/g, "");
    const foodData = foodDatabase[cleanName];
    if (!foodData) return alert("⚠️ Alimento não encontrado!");
    const gramsValue = parseFloat(grams);
    if (isNaN(gramsValue) || gramsValue <= 0) return alert("⚠️ Digite uma quantidade válida!");

    const factor = gramsValue / 100;
    const newFood: FoodEntry = {
      id: Date.now().toString(),
      name: cleanName,
      grams: gramsValue,
      carb: foodData.carb * factor,
      protein: foodData.protein * factor,
      fat: foodData.fat * factor,
    };

    setFoods([...foods, newFood]);
    addMacros(newFood.carb, newFood.protein, newFood.fat);

    setFoodName("");
    setGrams("");
  };

  const removeFood = (id: string) => {
    const item = foods.find(f => f.id === id);
    if (item) addMacros(-item.carb, -item.protein, -item.fat);
    setFoods(foods.filter(f => f.id !== id));
  };

  const clearAll = () => {
    resetMacros();
    setFoods([]);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus logo"
      />

      <Text style={styles.title}>📖 Diário Alimentar</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Alimento (ex: arroz)"
          placeholderTextColor="#888"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
          placeholder="Gramas"
          placeholderTextColor="#888"
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addFood}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.list}
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <Text style={styles.foodText}>
              {item.grams}g de {item.name} → {item.carb.toFixed(1)}g C | {item.protein.toFixed(1)}g P | {item.fat.toFixed(1)}g G
            </Text>
            <TouchableOpacity onPress={() => removeFood(item.id)}>
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearText}>Limpar Tudo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000" },
  logo: { width: 60, height: 60, resizeMode: "contain", position: "absolute", top: 20, left: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 30, marginBottom: 20, textAlign: "center", color: "#fff" },
  inputRow: { flexDirection: "row", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#222",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#36A2EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  list: { marginBottom: 20 },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#111",
    borderRadius: 8,
    marginBottom: 8,
  },
  foodText: { fontSize: 16, color: "#fff" },
  removeText: { color: "#FF4C4C", fontWeight: "bold", fontSize: 16 },
  clearButton: {
    backgroundColor: "#FF4C4C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
