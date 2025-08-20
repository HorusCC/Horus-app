// app/(tabs)/Nutrition.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { useMacros } from "../contexts/MacroContext";

interface DonutData {
  name: string;
  value: number;
  color: string;
  isCalorie?: boolean;
  totalMacros?: number;
}

const screenWidth = Dimensions.get("window").width;

// Dados da dieta (exemplo)
const dietData = [
  { title: "Café da Manhã", items: ["Ovos mexidos", "Pão integral", "Fruta"] },
  { title: "Lanche da Manhã", items: ["Iogurte", "Mix de castanhas"] },
  { title: "Almoço", items: ["Arroz integral", "Frango grelhado", "Salada"] },
  { title: "Lanche da Tarde", items: ["Sanduíche natural", "Suco natural"] },
  { title: "Jantar", items: ["Peixe grelhado", "Batata doce", "Legumes"] },
];

const Donut = ({ item }: { item: DonutData }) => {
  const radius = 50;
  const strokeWidth = 14;
  const totalMacros = item.isCalorie ? 1 : item.totalMacros || 1; // evitar divisão por zero
  const percentage = item.isCalorie ? 100 : (item.value / totalMacros) * 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.donutContainer}>
      <Svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2}>
        <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
          {/* Borda vidro */}
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius + 6}
            stroke="#aaa"
            strokeWidth={6}
            fill="transparent"
            opacity={0.2}
          />
          {/* Background circle */}
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#eee"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground circle */}
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - (circumference * percentage) / 100}
            strokeLinecap="round"
          />
        </G>
        {/* Percentual */}
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
        {Math.round(item.value)}{item.isCalorie ? " Kcal" : " g"}
      </Text>
      <Text style={styles.donutName}>{item.name}</Text>
    </View>
  );
};

export default function Nutrition() {
  // Pegando valores do MacroContext
  const { carb, protein, fat, kcal } = useMacros();

  // Monta os dados do donut atualizados
  const totalMacros = carb + protein + fat;
  const data: DonutData[] = [
    { name: "Carboidrato", value: carb, color: "#36A2EB", totalMacros },
    { name: "Proteína", value: protein, color: "#FF6384", totalMacros },
    { name: "Gordura", value: fat, color: "#FFCE56", totalMacros },
    { name: "Calorias", value: kcal, color: "#4BC0C0", isCalorie: true },
  ];

  return (
    <View style={styles.containerOuter}>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}>
        <Text style={styles.title}>Macronutrientes</Text>

        {/* Card único com borda para todos os donuts */}
        <View style={styles.donutsCardContainer}>
          <View style={styles.donutRow}>
            {data.map((item, index) => (
              <Donut key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Carrossel de dieta */}
        <Text style={styles.carouselTitle}>Dieta Recomendada</Text>
        <FlatList
          data={dietData}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.dietCard, { width: screenWidth * 0.8 }]}>
              <Text style={styles.dietCardTitle}>{item.title}</Text>
              {item.items.map((food, i) => (
                <Text key={i} style={styles.dietCardItem}>• {food}</Text>
              ))}
            </View>
          )}
        />
      </ScrollView>

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
  title: { marginTop: 40, fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#fff", alignSelf: "center" },

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  donutRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", width: "100%" },
  donutContainer: { alignItems: "center", margin: 10, width: 120 },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },

  carouselTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginTop: 30, marginBottom: 10, alignSelf: "center" },

  dietCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  dietCardTitle: { fontSize: 18, fontWeight: "bold", color: "#36A2EB", marginBottom: 8 },
  dietCardItem: { fontSize: 14, color: "#fff", marginBottom: 4 },

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
