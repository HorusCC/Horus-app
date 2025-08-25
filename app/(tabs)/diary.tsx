// app/(tabs)/DietDiary.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useMacros } from "../contexts/MacroContext";
import { useTheme } from "../contexts/ThemeContext";

type FoodEntry = {
  id: string;
  name: string;
  grams: number;
  carb: number;
  protein: number;
  fat: number;
};

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
  const { isDark } = useTheme();

  // cores de acordo com o tema
  const backgroundColor = isDark ? "#000" : "#fff";
  const cardColor = isDark ? "#111" : "#f0f0f0";
  const inputColor = isDark ? "#222" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const borderColor = "#0057C9";

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
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus logo"
      />

      <Text style={[styles.title, { color: "#0057C9" }]}>Diário Alimentar</Text>

      {/* Inputs */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 2, color: textColor, borderColor, backgroundColor: "#000" }]}
          placeholder="Alimento (ex: arroz)"
          placeholderTextColor={isDark ? "#5692B7" : "#5692B7"}
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 8, color: textColor, borderColor, backgroundColor: "#000" }]}
          placeholder="Gramas"
          placeholderTextColor={isDark ? "#5692B7" : "#5692B7"}
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
        />
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#000", borderColor }]}
        onPress={addFood}
      >
        <Text style={[styles.buttonText, { color: borderColor }]}>Adicionar</Text>
      </TouchableOpacity>

      {/* Lista de alimentos */}
      <FlatList
        style={styles.list}
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.foodItem, { backgroundColor: cardColor, borderColor }]}>
            <Text style={[styles.foodText, { color: textColor }]}>
              {item.grams}g de {item.name} → {item.carb.toFixed(1)}g C | {item.protein.toFixed(1)}g P | {item.fat.toFixed(1)}g G
            </Text>
            <TouchableOpacity onPress={() => removeFood(item.id)}>
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botão Limpar Tudo */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#000", borderColor: "#FF4C4C"}]}
        onPress={clearAll}
      >
        <Text style={[styles.buttonText, { color: "#FF4C4C" }]}>Limpar Tudo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  logo: { width: 60, height: 60, resizeMode: "contain", position: "absolute", top: 40, left: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 40, marginBottom: 20, textAlign: "center" },
  inputRow: { flexDirection: "row", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 20 },
  button: { padding: 12, borderRadius: 8, borderWidth: 1, alignItems: "center", marginBottom: 15 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  list: { marginBottom: 20 },
  foodItem: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderRadius: 20, borderWidth: 1, marginBottom: 8 },
  foodText: { fontSize: 16 },
  removeText: { color: "#FF4C4C", fontWeight: "bold", fontSize: 16 },
});
