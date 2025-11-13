import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiApp } from "@/services/api";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    if (!password || !confirm) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      await apiApp.post("/users/reset-password", { token, password });
      Alert.alert("Sucesso", "Senha redefinida com sucesso!");
      router.push("/login");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.response?.data?.message || "Falha ao redefinir senha"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoImage}
        source={require("../assets/images/horusNew.png")}
      />
      <Text style={styles.title}>Redefinir Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme a nova senha"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00060E",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoImage: { height: 180, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    backgroundColor: "#0057C9",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
