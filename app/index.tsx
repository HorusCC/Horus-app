import { Button } from "@/components/Button";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function WelcomePage() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/images/logo.png")}></Image>
            <Text style={styles.title}>Seja bem-vindo!</Text>
            <Text style={styles.subtitle}>Crie uma conta e acessa os benefícios</Text>
            <Button
                title="Começar"
                onPress={() => router.push("/login")}>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        paddingInline: 25
    },
    image: {
        height: 200,
        alignSelf: "center",
        objectFit: "contain"
    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 20
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        color: "#0057C9",
        marginBottom: 20
    }
})