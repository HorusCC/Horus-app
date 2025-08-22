import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";

export default function CafeDaManhaPage() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Café da manhã</Text>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#0057C9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por alimento"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#5692B7"
        />
      </View>

      {/* Botões principais */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="qr-code-scanner" size={30} color="#0057C9" />
          <Text style={styles.buttonText}>
            Fazer leitura em{"\n"}código de barras
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="qrcode" size={30} color="#0057C9" />
          <Text style={styles.buttonText}>Fazer leitura em{"\n"}código QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057C9",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 45,
    marginLeft: 8,
    color: "#000",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#0057C9",
    textAlign: "center",
    fontWeight: "500",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    fontSize: 12,
    color: "#0057C9",
    marginTop: 4,
  },
});
