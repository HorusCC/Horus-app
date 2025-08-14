import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CadastroPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [sexo, setSexo] = useState("");
    const [idade, setIdade] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [atividade, setAtividade] = useState("");
    const [resultado, setResultado] = useState<{ imc: number, tmb: number, classificacao: string } | null>(null);

    useEffect(() => {
        const alturaM = parseFloat(altura) / 100;
        const pesoKg = parseFloat(peso);
        const idadeNum = parseInt(idade);

        if (
            nome &&
            email &&
            senha &&
            sexo &&
            idade &&
            altura &&
            peso &&
            atividade &&
            !isNaN(alturaM) &&
            !isNaN(pesoKg) &&
            !isNaN(idadeNum)
        ) {
            const imc = pesoKg / (alturaM * alturaM);

            const tmb = sexo === "masculino"
                ? 88.36 + (13.4 * pesoKg) + (4.8 * parseFloat(altura)) - (5.7 * idadeNum)
                : 447.6 + (9.2 * pesoKg) + (3.1 * parseFloat(altura)) - (4.3 * idadeNum);

            let classificacao = "";
            if (imc < 18.5) classificacao = "Magreza";
            else if (imc < 25) classificacao = "Normal";
            else if (imc < 30) classificacao = "Sobrepeso";
            else classificacao = "Obesidade";

            setResultado({ imc, tmb, classificacao });
        } else {
            setResultado(null);
        }
    }, [nome, email, senha, sexo, idade, altura, peso, atividade]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image style={styles.image} source={require("../assets/images/logo.png")} />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha os dados abaixo para continuar</Text>

            <Input label="Nome" placeholder="Nome" value={nome} onChangeText={setNome} />
            <Input label="Email" placeholder="Email" value={email} onChangeText={setEmail} />
            <Input label="Senha" placeholder="Senha" value={senha} secureTextEntry onChangeText={setSenha} />
            <Input label="Idade" placeholder="Idade" value={idade} keyboardType="numeric" onChangeText={setIdade} />
            <Input label="Altura" placeholder="Altura (cm)" value={altura} keyboardType="numeric" onChangeText={setAltura} />
            <Input label="Peso" placeholder="Peso (kg)" value={peso} keyboardType="numeric" onChangeText={setPeso} />

            <Select
                label="Sexo"
                selectedValue={sexo}
                onValueChange={setSexo}
                options={[
                    { label: "Masculino", value: "masculino" },
                    { label: "Feminino", value: "feminino" }
                ]}
            />

            <Select
                label="Atividade Física"
                selectedValue={atividade}
                onValueChange={setAtividade}
                options={[
                    { label: "Sedentário", value: "sedentario" },
                    { label: "Levemente ativo", value: "leve" },
                    { label: "Moderadamente ativo", value: "moderado" },
                    { label: "Muito ativo", value: "ativo" }
                ]}
            />

            {resultado && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>IMC: {resultado.imc.toFixed(2)}</Text>
                    <Text style={styles.resultText}>TMB: {resultado.tmb.toFixed(2)} kcal/dia</Text>
                    <Text style={styles.resultText}>Classificação: {resultado.classificacao}</Text>

                    <View style={styles.table}>
                        <Text style={styles.tableTitle}>Classificação IMC</Text>
                        <Text>• Magreza: abaixo de 18.5</Text>
                        <Text>• Normal: entre 18.5 e 24.9</Text>
                        <Text>• Sobrepeso: entre 25.0 e 29.9</Text>
                        <Text>• Obesidade: acima de 30.0</Text>
                    </View>
                </View>
            )}

            <Button title="Cadastrar" onPress={() => router.push("/(tabs)/home")} style={styles.button} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: '#F5F5F5',
        flexGrow: 1,
        justifyContent: 'center',
    },
    image: {
        height: 150,
        alignSelf: "center",
        resizeMode: "contain"
    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        color: "#0057C9",
        marginBottom: 20
    },
    button: {
        marginVertical: 20
    },
    resultContainer: {
        marginTop: 10,
        backgroundColor: "#E0F7FA",
        padding: 15,
        borderRadius: 8
    },
    resultText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5
    },
    table: {
        marginTop: 10
    },
    tableTitle: {
        fontWeight: "700",
        marginBottom: 5
    }
});