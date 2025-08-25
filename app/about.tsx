// app/(tabs)/about.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/horusNew.png")} // logo padronizado
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sobre o Horus</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nossa Missão</Text>
        <Text style={styles.paragraph}>
          O Horus foi criado para ajudar você a acompanhar sua nutrição de forma prática
          e personalizada, trazendo gráficos, metas e dicas para melhorar seus hábitos
          alimentares.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Funcionalidades</Text>
        <Text style={styles.paragraph}>
          - Monitoramento de calorias, carboidratos, proteínas e gorduras{"\n"}
          - Gráficos de consumo diário e semanal{"\n"}
          - Registro de refeições e metas personalizadas{"\n"}
          - Interface minimalista e fácil de usar
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <Text style={styles.paragraph}>
          Sugestões ou problemas? Envie um e-mail para{" "}
          <Text style={styles.email}>contato@horusapp.com</Text>
        </Text>
      </View>

      <Text style={styles.footer}>© 2025 Horus App. Todos os direitos reservados.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // background preto padronizado
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#000",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057C9",
  },
  card: {
    backgroundColor: "#1A1A1A", // card escuro para contraste
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#ccc",
  },
  email: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginVertical: 20,
  },
});
