// app/(tabs)/Nutrition.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

interface DonutData {
  name: string;
  value: number; // quantidade em gramas ou Kcal
  color: string;
  isCalorie?: boolean; // indica se é Calorias
}

// Dados dos macros e calorias
const data: DonutData[] = [
  { name: "Carboidrato", value: 250, color: "#36A2EB" },
  { name: "Proteína", value: 120, color: "#FF6384" },
  { name: "Gordura", value: 70, color: "#FFCE56" },
  { name: "Calorias", value: 250 * 4 + 120 * 4 + 70 * 9, color: "#4BC0C0", isCalorie: true },
];

const Donut = ({ item }: { item: DonutData }) => {
  const radius = 50;
  const strokeWidth = 14;
  const totalMacros = 250 + 120 + 70;
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
        {/* Percentagem no centro */}
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

      {/* Valor abaixo da rosca */}
      <Text style={[styles.donutLabel, { color: item.color }]}>
        {item.value}{item.isCalorie ? " Kcal" : " g"}
      </Text>
      <Text style={styles.donutName}>{item.name}</Text>
    </View>
  );
};

export default function Nutrition() {
  return (
    <View style={styles.containerOuter}>
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
        <Text style={styles.title}>Macronutrientes</Text>
        <View style={styles.donutRow}>
          {data.map((item, index) => (
            <Donut key={index} item={item} />
          ))}
        </View>
      </ScrollView>

<Image source={require("../../assets/images/horusNew.png")}   
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, padding: 16 },
  title: { marginTop: 40, fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#fff", alignSelf: "center" },
  donutRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  donutContainer: {
    alignItems: "center",
    margin: 10,
    width: 120,
  },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },

  // logo styles
  logo: {
    position: "absolute",
    top: 30,
    right: 320,
    width: 64,
    height: 64,
    resizeMode: "contain",
    opacity: 0.98,
    // sombra (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // elevação Android
    elevation: 4,
  },
});
