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
import { Ionicons } from "@expo/vector-icons";
import { useDataStore } from "@/store/data";
import { api } from "../../services/api";

export default function GenerateDiet() {
  const user = useDataStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
      <Text style={styles.title}>Dieta</Text>

      <TouchableOpacity style={styles.generateButton}>
        <Ionicons name="restaurant-outline" size={24} color="#fff" />
        <Text style={styles.generateButtonText}>Gerar Dieta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 60 },
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
  mealItems: { color: "#fff", fontSize: 14 },
});
