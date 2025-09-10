// app/(tabs)/more.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MoreScreen() {
  const router = useRouter();

  const options = [
    {
      icon: "person-circle-outline",
      label: "Meu Perfil",
      action: () => router.push("/profile"),
    },
    {
      icon: "settings-outline",
      label: "Configurações",
      action: () => router.push("/settings"),
    },
    {
      icon: "information-circle-outline",
      label: "Sobre o App",
      action: () => router.push("/about"),
    },
    {
      icon: "log-out-outline",
      label: "Sair",
      action: () => router.replace("/login"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Logo no topo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/horusNew.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.header}>Mais opções</Text>

      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, item.label === "Sair" && styles.logoutOption]}
          onPress={item.action}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={item.label === "Sair" ? "#D9534F" : "#333"}
          />
          <Text
            style={[styles.label, item.label === "Sair" && styles.logoutLabel]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 60,
    marginTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 60,
    color: "#0057C9",
    textAlign: "center",
    marginTop: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: "#5692B7",
  },
  logoutOption: {
    borderWidth: 1,
    borderColor: "#D9534F",
  },
  logoutLabel: {
    color: "#D9534F",
    fontWeight: "bold",
  },
});
