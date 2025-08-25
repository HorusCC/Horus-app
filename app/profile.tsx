// app/(tabs)/profile.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function ProfileScreen() {
  const userData = {
    peso: "72 kg",
    altura: "1,78 m",
    imc: "22.7",
    tmb: "1.750 kcal",
    idade: "23 anos",
    sexo: "Masculino",
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header com logo + título */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/horusNew.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.subtitle}>Informações Pessoais</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Idade</Text>
            <Text style={styles.value}>{userData.idade}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Sexo</Text>
            <Text style={styles.value}>{userData.sexo}</Text>
          </View>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.subtitle}>Dados Corporais</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Peso</Text>
            <Text style={styles.value}>{userData.peso}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Altura</Text>
            <Text style={styles.value}>{userData.altura}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>IMC</Text>
            <Text style={styles.value}>{userData.imc}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>TMB</Text>
            <Text style={styles.value}>{userData.tmb}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000", // fundo 100% preto
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  logo: { width: 60, height: 60, resizeMode: "contain", position: "absolute", top: 25, left: 5 },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: "bold",
    color: "#0057C9",
    marginTop:40,
    textAlign: "center",
  },
  profileBox: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5692B7",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#0057C9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#5692B7",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
