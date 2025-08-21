import { Button } from "@/components/Button";
import { router } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function WelcomePage() {
  const { colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        style={styles.image}
        source={require("../assets/images/logo.png")}
      />
      <Text style={[styles.title, { color: colors.text }]}>
        Seja bem-vindo!
      </Text>
      <Text style={[styles.subtitle, { color: colors.tint }]}>
        Crie uma conta e acessa os benefícios
      </Text>
      {/* <Button
        style={[
          styles.button,
          { backgroundColor: colors.buttonPrimary, color: colors.text },
        ]}
        title="Começar"
        onPress={() => router.push("/login")}
      /> */}
      <Text
        style={[
          styles.button,
          {
            backgroundColor: colors.buttonPrimary,
            color: colors.buttonTextInicio,
          },
        ]}
        onPress={() => router.push("/login")}
      >
        Começar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingInline: 25,
  },
  image: {
    height: 200,
    alignSelf: "center",
    objectFit: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    padding: 15,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    borderRadius: 20,
  },
});
