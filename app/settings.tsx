// app/settings.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Configurações</Text>

      {/* Tema escuro */}
      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="moon-outline" size={24} color="#0057C9" />
          <Text style={styles.optionText}>Modo escuro</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          thumbColor={isDarkMode ? "#0057C9" : "#ccc"}
          trackColor={{ false: "#767577", true: "#80BFFF" }}
        />
      </View>

      {/* Alterar senha */}
      <TouchableOpacity style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="key-outline" size={24} color="#0057C9" />
          <Text style={styles.optionText}>Alterar senha</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>

      {/* Privacidade */}
      <TouchableOpacity style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="lock-closed-outline" size={24} color="#0057C9" />
          <Text style={styles.optionText}>Privacidade</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>

      {/* Sobre */}
      <TouchableOpacity style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Ionicons name="information-circle-outline" size={24} color="#0057C9" />
          <Text style={styles.optionText}>Sobre o app</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057C9",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#5692B7",
    fontFamily: "Roboto",
  },
});
