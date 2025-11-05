// app/change-password.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    // Aqui você adicionaria a lógica para alterar a senha no backend
    Alert.alert("Sucesso", "Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 30 }}>
      <Text style={styles.header}>Alterar Senha</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Senha atual</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Digite sua senha atual"
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#777"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057C9",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#000",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0057C9",
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
