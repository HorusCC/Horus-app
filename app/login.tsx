import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { router } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useTheme } from "@/contexts/ThemeContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDataStore } from "@/store/data";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .max(100),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [isSelected, setSelection] = useState(false);
  const { colors, theme } = useTheme();
  const users = [
    { email: "lorenzo@email.com", password: "123456" },
    { email: "admin@email.com", password: "admin123" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const setPageOne = useDataStore((state) => state.setPageOne);

  function handleCreate(data: FormData) {
    const userExists = users.some(
      (user) => user.email === data.email && user.password === data.password
    );

    if (userExists) {
      setPageOne({
        email: data.email,
        senha: data.password,
      });
      Toast.show({
        type: "success",
        text1: "Login realizado com sucesso!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Credenciais inválidas",
        text2: "Verifique seu email e senha",
      });
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        style={styles.image}
        source={
          theme === "dark"
            ? require("../assets/images/horusNew.png")
            : require("../assets/images/logo.png")
        }
      />
      <Text style={[styles.title, { color: colors.text }]}>
        Seja Bem-vindo!
      </Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Preencha os campos para acessar o aplicativo
      </Text>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={25}
          color="#5692B7"
          style={styles.icon}
        />
        <Input
          name="email"
          control={control}
          placeholder="Email"
          type="email"
          error={errors.email?.message}
          placeholderTextColor="#5692B7"
          keyboardType="default"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={25}
          color="#5692B7"
          style={styles.icon}
        />
        <Input
          name="password"
          control={control}
          placeholder="Senha"
          error={errors.password?.message}
          placeholderTextColor="#5692B7"
          secureTextEntry
          type="password"
          keyboardType="default"
        />
      </View>

      <View style={styles.containerSenha}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
          <Text
            style={[styles.labelSecundary, { color: colors.azulClaroPadrao }]}
          >
            Lembrar-me?
          </Text>
        </View>

        {/* Botão de esqueci a senha */}
        <Pressable onPress={() => router.push("/forgot")}>
          <Text style={[styles.textForgot, { color: colors.text }]}>
            Esqueci a senha
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
        onPress={handleSubmit(handleCreate)}
      >
        <Text style={[styles.subtitle, { color: colors.textButton }]}>
          Entrar
        </Text>
      </Pressable>

      <Text style={[styles.labelSecundary, { color: colors.text }]}>
        Novo por aqui?{" "}
        <Text
          style={[styles.register, { color: colors.azulClaroPadrao }]}
          onPress={() => router.push("/register")}
        >
          Registre-se
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
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
    color: "#5692B7",
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
    borderRadius: 10,
  },
  dontHaveAccount: {
    textAlign: "right",
  },
  register: {
    fontWeight: "500",
  },
  label: {
    marginHorizontal: 8,
  },
  labelSecundary: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5692B7",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 4,
  },
  textForgot: {
    fontWeight: "600",
    fontSize: 16,
  },
});
