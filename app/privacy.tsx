// app/privacy.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";

export default function PrivacyScreen() {
  const [shareData, setShareData] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [cameraPermission, setCameraPermission] = React.useState(false);
  const [locationPermission, setLocationPermission] = React.useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <Text style={styles.header}>Privacidade</Text>

      {/* Compartilhar dados */}
      {/* <View style={styles.card}>
        <Text style={styles.label}>Permitir Bluetooth</Text>
        <Switch
          value={shareData}
          onValueChange={setShareData}
          thumbColor={shareData ? "#0057C9" : "#ccc"}
          trackColor={{ false: "#767577", true: "#80BFFF" }}
        />
      </View> */}

      {/* Notificações */}
      {/* <View style={styles.card}>
        <Text style={styles.label}>Receber notificações</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? "#0057C9" : "#ccc"}
          trackColor={{ false: "#767577", true: "#80BFFF" }}
        />
      </View> */}

      {/* Permissão de localização */}
      {/* <View style={styles.card}>
        <Text style={styles.label}>Permissão de localização</Text>
        <Switch
          value={locationPermission}
          onValueChange={setLocationPermission}
          thumbColor={locationPermission ? "#0057C9" : "#ccc"}
          trackColor={{ false: "#767577", true: "#80BFFF" }}
        />
      </View> */}

      {/* Política de privacidade */}
      <View style={styles.card}>
        <Text style={styles.label}>Política de Privacidade</Text>
        <Text style={styles.text}>
          Sua privacidade é importante para nós. Todos os dados coletados são
          usados apenas para melhorar sua experiência no Horus e nunca serão
          vendidos a terceiros.
        </Text>
      </View>

      {/* Termos de uso */}
      <View style={styles.card}>
        <Text style={styles.label}>Termos de Uso</Text>
        <Text style={styles.text}>
          Ao usar o Horus, você concorda com nossos termos de uso, que descrevem
          direitos, responsabilidades e limitações do serviço.
        </Text>
      </View>
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
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  text: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
});
