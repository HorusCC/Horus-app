import { View, Text, StyleSheet } from "react-native";
import { Tabs, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function ProfilePage() {
  // 🔹 Dados mockados do usuário
  const user = {
    nome: "João Silva",
    email: "joao.silva@example.com",
    idade: 25,
    altura: 176, // cm
    peso: 68, // kg
    sexo: "Masculino",
    atividadeFisica: "Treino 4x/semana",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Tabs.Screen
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={22} name="filter" color={color} />
            ),
          }}
        />
        Perfil do Usuário
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{user.nome}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Idade:</Text>
        <Text style={styles.value}>{user.idade} anos</Text>

        <Text style={styles.label}>Altura:</Text>
        <Text style={styles.value}>{user.altura} cm</Text>

        <Text style={styles.label}>Peso:</Text>
        <Text style={styles.value}>{user.peso} kg</Text>

        <Text style={styles.label}>Sexo:</Text>
        <Text style={styles.value}>{user.sexo}</Text>

        <Text style={styles.label}>Atividade Física:</Text>
        <Text style={styles.value}>{user.atividadeFisica}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // fundo dark
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
