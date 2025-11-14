import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useTheme } from "@/contexts/ThemeContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDataStore } from "@/store/data";
import { apiApp } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const setPageOne = useDataStore((state: any) => state.setPageOne); // <- ajustado
  const setPageTwo = useDataStore((state: any) => state.setPageTwo);

  async function handleCreate(data: FormData) {
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    try {
      const res = await apiApp.post("/users/login", { email, password });

      const token: string | undefined = res?.data?.token;
      const user = res?.data?.user;

      if (isSelected) {
        await AsyncStorage.setItem(
          "@remember_login",
          JSON.stringify({ email, password })
        );
      } else {
        await AsyncStorage.removeItem("@remember_login");
      }

      setPageOne({ email, senha: password });
      setPageTwo({
        nome: user.name,
        email: user.email,
        idade: String(user.age),
        altura: String(user.height),
        peso: String(user.weight),
        sexo: user.gender,
        objetivo: user.objective,
        atividade: user.level,
      });

      Toast.show({ type: "success", text1: "Login realizado com sucesso!" });
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("🔥 ERRO COMPLETO:", err); // <-- Mostra tudo no console
      console.log("📩 RESPONSE:", err?.response?.data); // <-- Mostra resposta do backend

      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      let msg = "Erro desconhecido";
      if (backendMsg) msg = backendMsg;
      else if (status === 401) msg = "Credenciais inválidas";
      else if (status === 404) msg = "Usuário não encontrado";
      else if (status === 500) msg = "Erro interno no servidor";
      else if (err.message.includes("Network"))
        msg = "Falha de conexão com o servidor";

      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: msg,
      });

      // opcional: alert para debug
      Alert.alert("Erro no login", msg);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@remember_login");
        if (saved) {
          const { email, password } = JSON.parse(saved);
          setValue("email", email);
          setValue("password", password);
        }
      } catch (error) {
        console.log("Erro ao recuperar credenciais:", error);
      }
    })();
  }, [setValue]);

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
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 25 },
  containerSenha: { flexDirection: "row", justifyContent: "space-around" },
  image: { height: 250, alignSelf: "center", resizeMode: "contain" },
  title: { fontSize: 30, fontWeight: "500", textAlign: "center" },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  checkboxContainer: { flexDirection: "row", marginBottom: 15 },
  checkbox: { alignSelf: "center" },
  button: { marginBottom: 20, borderRadius: 10 },
  register: { fontWeight: "500" },
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
  icon: { marginRight: 4 },
  textForgot: { fontWeight: "600", fontSize: 16 },
});
