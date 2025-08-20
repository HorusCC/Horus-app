// app/(tabs)/DietDiary.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from "react-native";

export default function DietDiary() {
  const [meal, setMeal] = useState("");
  const [diary, setDiary] = useState<string[]>([]);

  const addMeal = () => {
    if (meal.trim() === "") return;
    setDiary([meal, ...diary]);
    setMeal("");
  };

  const removeMeal = (index: number) => {
    const newDiary = [...diary];
    newDiary.splice(index, 1);
    setDiary(newDiary);
  };

  return (
    <View style={styles.containerOuter}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Diário de Alimentação</Text>

        {/* Campo para registrar refeição */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="O que você comeu?"
            placeholderTextColor="#aaa"
            value={meal}
            onChangeText={setMeal}
            style={styles.input}
          />
          <TouchableOpacity onPress={addMeal} style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de refeições registradas */}
        <FlatList
          data={diary}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.diaryItem}>
              <Text style={styles.diaryText}>• {item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMeal(index)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      {/* Logo Horus */}
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },
  scrollContent: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", alignSelf: "center", marginBottom: 20, marginTop: 40 },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 12,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#36A2EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

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
