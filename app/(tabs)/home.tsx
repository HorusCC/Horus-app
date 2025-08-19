// app/(tabs)/home.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { VictoryPie } from "victory-native";
import { useTheme } from "../../contexts"; // import direto da pasta com index.tsx

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const data = [
    { x: "Proteína", y: 120 },
    { x: "Carboidratos", y: 250 },
    { x: "Gorduras", y: 60 },
  ];

  const backgroundColor = theme === "dark" ? "#00060E" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#000";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        📊 Dashboard Nutricional
      </Text>

      <VictoryPie
        data={data}
        colorScale={["#4CAF50", "#FF9800", "#F44336"]}
        innerRadius={60}
        padAngle={2}
        style={{
          labels: { fill: textColor, fontSize: 14, fontWeight: "bold" },
        }}
      />

      <View style={styles.kcalContainer}>
        <Text style={styles.kcalText}>🔥 Total Kcal: 2100</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          Mudar para {theme === "dark" ? "Light" : "Dark"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  kcalContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#5692B7",
  },
  kcalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#FF9800",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
