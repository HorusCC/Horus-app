// app/(tabs)/Nutrition.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useMacros } from "../contexts/MacroContext";

interface DonutData {
  name: string;
  value: number;
  color: string;
  isCalorie?: boolean;
  totalMacros?: number;
}

const screenWidth = Dimensions.get("window").width;

const initialMeals = [
  { id: "1", name: "Café da Manhã", items: "" },
  { id: "2", name: "Lanche da Manhã", items: "" },
  { id: "3", name: "Almoço", items: "" },
  { id: "4", name: "Café da Tarde", items: "" },
  { id: "5", name: "Jantar", items: "" },
];

const foodDatabase: Record<
  string,
  { carb: number; protein: number; fat: number }
> = {
  // Café da manhã
  Pão: { carb: 49, protein: 9, fat: 3.2 },
  Ovo: { carb: 1, protein: 13, fat: 11 },
  Leite: { carb: 5, protein: 3.4, fat: 3.3 },
  Aveia: { carb: 66, protein: 17, fat: 7 },
  Banana: { carb: 23, protein: 1.1, fat: 0.3 },
  Maçã: { carb: 14, protein: 0.3, fat: 0.2 },
  Iogurte: { carb: 6, protein: 3.5, fat: 3 },
  // Lanche da manhã
  Castanha: { carb: 14, protein: 20, fat: 50 },
  "Barra de Cereal": { carb: 65, protein: 7, fat: 10 },
  "Suco de Laranja": { carb: 10, protein: 0.7, fat: 0.2 },
  // Almoço
  Arroz: { carb: 28, protein: 2.5, fat: 0.3 },
  Feijão: { carb: 14, protein: 9, fat: 0.5 },
  Frango: { carb: 0, protein: 27, fat: 3.6 },
  Peixe: { carb: 0, protein: 20, fat: 5 },
  Salada: { carb: 3, protein: 1, fat: 0 },
  Legumes: { carb: 7, protein: 2, fat: 0.1 },
  // Café da tarde
  "Pão Integral": { carb: 48, protein: 9, fat: 3 },
  Queijo: { carb: 1.3, protein: 25, fat: 33 },
  // Jantar
  "Arroz Integral": { carb: 23, protein: 2.6, fat: 1.5 },
  "Frango Grelhado": { carb: 0, protein: 27, fat: 3 },
  "Salada Jantar": { carb: 2, protein: 1, fat: 0 },
  // Extras experimentais
  Quinoa: { carb: 21, protein: 4.1, fat: 1.9 },
  "Batata Doce": { carb: 20, protein: 1.6, fat: 0.1 },
  Cenoura: { carb: 10, protein: 0.9, fat: 0.2 },
  Tomate: { carb: 4, protein: 0.9, fat: 0.2 },
  Abacate: { carb: 9, protein: 2, fat: 15 },
  "Peito de Peru": { carb: 0, protein: 29, fat: 1 },
};

const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");

const Donut = ({ item }: { item: DonutData }) => {
  const radius = 50;
  const strokeWidth = 14;
  const totalMacros = item.isCalorie ? 1 : item.totalMacros || 1;
  const percentage = item.isCalorie ? 100 : (item.value / totalMacros) * 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.donutContainer}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
      >
        <G
          rotation="-90"
          origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}
        >
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#2d2d2d"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={
              circumference - (circumference * percentage) / 100
            }
            strokeLinecap="round"
          />
        </G>
        <SvgText
          x={radius + strokeWidth}
          y={radius + strokeWidth + 5}
          fontSize="16"
          fontWeight="bold"
          fill={item.color}
          textAnchor="middle"
        >
          {Math.round(percentage)}%
        </SvgText>
      </Svg>

      <Text style={[styles.donutLabel, { color: item.color }]}>
        {Math.round(item.value)}
        {item.isCalorie ? " Kcal" : " g"}
      </Text>
      <Text style={styles.donutName}>{item.name}</Text>
    </View>
  );
};

export default function Nutrition() {
  const { carb, protein, fat, addMacros } = useMacros();

  const totalMacros = carb + protein + fat;

  const [mealsState, setMealsState] = useState(initialMeals);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  const [foodName, setFoodName] = useState("");
  const [foodGrams, setFoodGrams] = useState("");

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [selectedMealForCustom, setSelectedMealForCustom] = useState<any>(null);

  const data: DonutData[] = [
    { name: "Carboidrato", value: carb, color: "#36A2EB", totalMacros },
    { name: "Proteína", value: protein, color: "#FF6384", totalMacros },
    { name: "Gordura", value: fat, color: "#FFCE56", totalMacros },
    {
      name: "Calorias",
      value: carb * 4 + protein * 4 + fat * 9,
      color: "#4BC0C0",
      isCalorie: true,
    },
  ];

  const handleAddFood = (meal: any) => {
    setCurrentMeal(meal);
    setFoodName("");
    setFoodGrams("");
    setModalVisible(true);
  };

  const saveFood = () => {
    const cleanName = normalizeName(foodName);
    const matchedFood = Object.keys(foodDatabase).find(
      (key) => normalizeName(key) === cleanName
    );
    if (!matchedFood)
      return Alert.alert("⚠️ Alimento não encontrado na base de dados!");
    const foodData = foodDatabase[matchedFood];

    const gramsValue = parseFloat(foodGrams);
    if (isNaN(gramsValue) || gramsValue <= 0)
      return Alert.alert("⚠️ Digite uma quantidade válida!");

    const factor = gramsValue / 100;
    const carbValue = foodData.carb * factor;
    const proteinValue = foodData.protein * factor;
    const fatValue = foodData.fat * factor;

    addMacros(carbValue, proteinValue, fatValue);

    if (currentMeal) {
      const updatedMeals = mealsState.map((meal) =>
        meal.id === currentMeal.id
          ? {
              ...meal,
              items: meal.items ? meal.items + ", " + matchedFood : matchedFood,
            }
          : meal
      );
      setMealsState(updatedMeals);
    }

    setModalVisible(false);
  };

  const openCustomModal = (meal: any) => {
    setSelectedMealForCustom(meal);
    setCustomModalVisible(true);
  };

  const removeFoodFromMeal = (food: string) => {
    if (!selectedMealForCustom) return;

    const updatedMeals = mealsState.map((meal) => {
      if (meal.id === selectedMealForCustom.id) {
        const itemsArray = meal.items
          .split(", ")
          .filter((item: string) => item !== food);

        const foodData = foodDatabase[food];
        if (foodData) {
          addMacros(-foodData.carb, -foodData.protein, -foodData.fat);
        }

        return { ...meal, items: itemsArray.join(", ") };
      }
      return meal;
    });

    setMealsState(updatedMeals);

    // Se nenhuma refeição tiver alimentos, zera todos os macros
    const hasAnyFood = updatedMeals.some((meal) => meal.items.trim() !== "");
    if (!hasAnyFood) {
      addMacros(-carb, -protein, -fat);
    }
  };

  return (
    <View style={styles.containerOuter}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Macronutrientes</Text>

        <View style={styles.donutsCardContainer}>
          <View style={styles.donutRow}>
            {data.map((item, index) => (
              <Donut key={index} item={item} />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Alimentação</Text>
        {mealsState.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>{meal.name}</Text>
              {meal.items ? (
                <Text style={styles.mealItems}>{meal.items}</Text>
              ) : (
                <Text
                  style={[
                    styles.mealItems,
                    { fontStyle: "italic", color: "#888" },
                  ]}
                >
                  Nenhum alimento adicionado
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFood(meal)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  { marginLeft: 8, backgroundColor: "#FF4C4C" },
                ]}
                onPress={() => openCustomModal(meal)}
                disabled={!meal.items}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Adicionar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Adicionar alimento
            </Text>
            <TextInput
              placeholder="Nome do alimento"
              placeholderTextColor="#888"
              value={foodName}
              onChangeText={setFoodName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Gramas"
              placeholderTextColor="#888"
              value={foodGrams}
              onChangeText={setFoodGrams}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <Button title="Salvar" onPress={saveFood} />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="#FF4C4C"
            />
          </View>
        </View>
      </Modal>

      {/* Modal Remover */}
      <Modal
        visible={customModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Remover alimento
            </Text>
            {selectedMealForCustom &&
              selectedMealForCustom.items.split(", ").map((food: string) => (
                <TouchableOpacity
                  key={food}
                  onPress={() => removeFoodFromMeal(food)}
                >
                  <Text style={{ fontSize: 16, padding: 5, color: "#fff" }}>
                    {food} ❌
                  </Text>
                </TouchableOpacity>
              ))}
            <Button
              title="Fechar"
              onPress={() => setCustomModalVisible(false)}
              color="#FF4C4C"
            />
          </View>
        </View>
      </Modal>

      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    textAlign: "center",
    color: "#0057C9",
  },
  donutsCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  donutRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  donutContainer: { alignItems: "center", margin: 10, width: 120 },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0057C9",
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 16,
  },
  mealCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  mealTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  mealItems: { color: "#aaa", fontSize: 14, marginTop: 4 },
  addButton: {
    backgroundColor: "#0057C9",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dietCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  dietCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#36A2EB",
    marginBottom: 8,
  },
  dietCardItem: { fontSize: 14, color: "#fff", marginBottom: 4 },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 40,
    left: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 20,
    borderColor: "#5692B7",
    borderWidth: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 8,
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#000",
    color: "#fff",
  },
});
