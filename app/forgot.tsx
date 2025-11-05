import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu email.");
      return;
    }
    // Aqui vai a lógica de envio do email
    Alert.alert("Sucesso", "Um link de redefinição foi enviado para seu email.");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        style={styles.logoImage}
        source={require("../assets/images/horusNew.png")}
      />

      {/* Título */}
      <Text style={styles.title}>Esqueceu a senha?</Text>
      <Text style={styles.subtitle}>Preencha o campo para recuperar sua conta</Text>

      {/* Campo de email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Botão enviar */}
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      {/* Link para login */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Voltar para login</Text>
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
  logoImage: {
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#5692B7",
    textAlign: "center",
    marginBottom: 20,
  },
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
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#5692B7",
    fontSize: 14,
    marginTop: 10,
  },
});
