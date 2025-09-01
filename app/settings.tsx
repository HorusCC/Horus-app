// app/settings.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../app/contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme(); // 🔹 tema global

  const backgroundColor = isDark ? "#000" : "#fff";
  const cardColor = isDark ? "#111" : "#f0f0f0";
  const textColor = isDark ? "#fff" : "#000";
  const borderColor = "#0057C9";

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: "#0057C9" }]}>Configurações</Text>

      {/* Tema escuro */}
      <View style={[styles.optionRow, { backgroundColor: "#000", borderColor }]}>
        <View style={styles.optionLeft}>
          <Ionicons name="moon-outline" size={24} color="#0057C9" />
          <Text style={[styles.optionText, { color: "#5692B7" }]}>Modo Escuro</Text>
        </View>
        <Switch
          value={isDark}           // 🔹 valor do tema global
          onValueChange={toggleTheme} // 🔹 inverte tema
          thumbColor={isDark ? "#000" : "#fff"}
          trackColor={{ false: "#ccc", true: "#80BFFF" }}
        />
      </View>

      {/* Alterar senha */}
      <TouchableOpacity
        style={[styles.optionRow, { backgroundColor: "#000", borderColor }]}
        onPress={() => router.push("/change-password")}
      >
        <View style={styles.optionLeft}>
          <Ionicons name="key-outline" size={24} color="#0057C9" />
          <Text style={[styles.optionText, { color: "#5692B7" }]}>Alterar Senha</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>

      {/* Privacidade */}
      <TouchableOpacity
        style={[styles.optionRow, { backgroundColor: "#000", borderColor }]}
        onPress={() => router.push("/privacy")}
      >
        <View style={styles.optionLeft}>
          <Ionicons name="lock-closed-outline" size={24} color="#0057C9" />
          <Text style={[styles.optionText, { color: "#5692B7" }]}>Privacidade</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>

      {/* Sobre */}
      <TouchableOpacity
        style={[styles.optionRow, { backgroundColor: "#000", borderColor }]}
        onPress={() => router.push("/about")}
      >
        <View style={styles.optionLeft}>
          <Ionicons name="information-circle-outline" size={24} color="#0057C9" />
          <Text style={[styles.optionText, { color: "#5692B7" }]}>Sobre o App</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 50 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { marginLeft: 10, fontSize: 16, fontFamily: "Roboto" },
});
