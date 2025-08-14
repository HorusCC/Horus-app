import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // ou outro pacote
import Checkbox from "expo-checkbox";
import { useState } from "react";
import Toast from "react-native-toast-message";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [password, setPassword] = useState("");
  const users = [
    { email: "lorenzo@email.com", password: "123456" },
    { email: "admin@email.com", password: "admin123" },
  ];

  function handleLogin() {
    const userExists = users.find(
      (user) => user.email === email && user.password === password
    );

    if (userExists) {
      Toast.show({
        type: "success",
        text1: "Login realizado com sucesso!",
      });
      setTimeout(() => router.push("/(tabs)/home"), 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "Credenciais inválidas",
        text2: "Verifique seu email e senha",
      });
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/horusNew.png")}
      />
      <Text style={styles.title}>Seja Bem-vindo!</Text>
      <Text style={styles.subtitle}>
        Preencha os campos para acessar o aplicativo
      </Text>
      {/* <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      /> */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={25}
          color="#5692B7"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#5692B7"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="security"
          size={25}
          color="#5692B7"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#5692B7"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.containerSenha}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
          <Text style={styles.labelSecundary}>Lembrar-me?</Text>
        </View>
        <Text style={styles.subtitle}> Esqueci a senha</Text>
      </View>
      ;{/* <Text style={styles.resetPassword}>Lembrar-me</Text> */}
      <Button title="Entrar" style={styles.button} onPress={handleLogin} />
      <Text style={styles.labelSecundary}>
        Novo por aqui?{" "}
        <Text style={styles.register} onPress={() => router.push("/register")}>
          Registre-se
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00060E",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  containerSenha: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  image: {
    height: 250,
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#0057C9",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  checkbox: {
    alignSelf: "center",
  },
  resetPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: "#0057C9",
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
  dontHaveAccount: {
    textAlign: "right",
  },
  register: {
    fontWeight: "500",
    color: "#0057C9",
  },
  label: {
    marginHorizontal: 8,
  },
  labelSecundary: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#5692B7",
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0057C9",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#000",
  },
});
