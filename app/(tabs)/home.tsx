// app/(tabs)/home.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useMacros } from "../contexts/MacroContext";
import { searchFoodsByName, FoodItem } from "../../src/services/openFoodFacts";
import { macrosForServing, Macros, round1 } from "../../src/utils/nutrition";
import { useRouter } from "expo-router";

interface DonutData {
  name: string;
  value: number;
  color: string;
  isCalorie?: boolean;
}) => {
  const radius = 50,
    strokeWidth = 14;
  const total = isCalorie ? 1 : totalMacros || 1;
  const pct = isCalorie ? 100 : (value / total) * 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.donutContainer}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
      >
        <G
          rotation="-90"
          origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}
        >
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#2d2d2d"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={
              circumference - (circumference * percentage) / 100
            }
            strokeLinecap="round"
          />
        </G>
        <SvgText
          x={radius + strokeWidth}
          y={radius + strokeWidth + 5}
          fontSize="16"
          fontWeight="bold"
          fill={item.color}
          textAnchor="middle"
        >
          {Math.round(percentage)}%
        </SvgText>
      </Svg>

      <Text style={[styles.donutLabel, { color: item.color }]}>
        {Math.round(item.value)}
        {item.isCalorie ? " Kcal" : " g"}
      </Text>
      <Text style={styles.donutName}>{item.name}</Text>
    </View>
  );
};

export default function Nutrition() {
  const { carb, protein, fat, addMacros } = useMacros();

  const totalMacros = carb + protein + fat;

  const [mealsState, setMealsState] = useState(initialMeals);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  const [foodName, setFoodName] = useState("");
  const [foodGrams, setFoodGrams] = useState("");

  // busca dentro do modal
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState(q);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // seleção e porção
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 400);
    return () => clearTimeout(id);
  }, [q]);
  useEffect(() => {
    setPage(1);
    setResults([]);
    setError(null);
  }, [debounced]);

  useEffect(() => {
    if (!modalVisible || !debounced) {
      setResults([]);
      setHasMore(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    (async () => {
      try {
        setLoading(true);
        const { items, pageCount } = await searchFoodsByName(
          debounced,
          page,
          24,
          controller.signal
        );
        setResults((prev) => (page === 1 ? items : [...prev, ...items]));
        setHasMore(page < pageCount);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Erro ao buscar");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debounced, page, modalVisible]);

  const openAddModal = (meal: Meal) => {
    setCurrentMeal(meal);
    setQ("");
    setSelected(null);
    setGrams("100");
    setModalVisible(true);
  };

  const addSelectedToMeal = () => {
    if (!currentMeal || !selected) return;
    const g = Number(grams);
    if (!Number.isFinite(g) || g <= 0)
      return Alert.alert("Informe gramas válidos");

    const portion = macrosForServing(selected.nutrientsPer100g, g);

    addMacros(portion.carbs_g, portion.protein_g, portion.fat_g);

    const entry: MealItem = {
      id: Math.random().toString(36).slice(2),
      label: selected.name,
      grams: g,
      macros: portion,
    };
    setMealsState((ms) =>
      ms.map((m) =>
        m.id === currentMeal.id ? { ...m, items: [entry, ...m.items] } : m
      )
    );
    setModalVisible(false);
  };

  const openRemoveModal = (meal: Meal) => {
    setCurrentMeal(meal);
    setCustomModalVisible(true);
  };

  // remover
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const removeItem = (mealId: string, itemId: string) => {
    setMealsState((ms) =>
      ms.map((m) => {
        if (m.id !== mealId) return m;
        const toRemove = m.items.find((i) => i.id === itemId);
        if (toRemove)
          addMacros(
            -toRemove.macros.carbs_g,
            -toRemove.macros.protein_g,
            -toRemove.macros.fat_g
          );
        return { ...m, items: m.items.filter((i) => i.id !== itemId) };
      })
    );
  };

  const data: DonutData[] = [
    { name: "Carboidrato", value: carb, color: "#36A2EB", totalMacros },
    { name: "Proteína", value: protein, color: "#FF6384", totalMacros },
    { name: "Gordura", value: fat, color: "#FFCE56", totalMacros },
    {
      name: "Calorias",
      value: carb * 4 + protein * 4 + fat * 9,
      color: "#4BC0C0",
      isCalorie: true as const,
    },
  ];

  const router = useRouter();

  // ---------- helpers de exibição por porção (igual à tela de search) ----------
  function deriveDisplayNutrients(item: FoodItem) {
    if (item.nutrientsPerServing) {
      const n = item.nutrientsPerServing;
      const kcal =
        n.kcal ??
        Math.round(
          (n.carbs_g ?? 0) * 4 + (n.protein_g ?? 0) * 4 + (n.fat_g ?? 0) * 9
        );
      return {
        basis: `por porção${
          item.serving?.sizeText ? ` (${item.serving.sizeText})` : ""
        }`,
        carbs: n.carbs_g ?? 0,
        prot: n.protein_g ?? 0,
        fat: n.fat_g ?? 0,
        kcal,
      };
    }
    if (item.serving?.grams && item.nutrientsPer100g) {
      const f = item.serving.grams / 100;
      const n = item.nutrientsPer100g;
      const carbs = (n.carbs_g ?? 0) * f;
      const prot = (n.protein_g ?? 0) * f;
      const fat = (n.fat_g ?? 0) * f;
      const kcal =
        n.kcal != null
          ? Math.round(n.kcal * f)
          : Math.round(carbs * 4 + prot * 4 + fat * 9);
      return {
        basis: `por porção (${item.serving.sizeText})`,
        carbs,
        prot,
        fat,
        kcal,
      };
    }
    const n = item.nutrientsPer100g ?? {};
    const kcal =
      n.kcal ??
      Math.round(
        (n.carbs_g ?? 0) * 4 + (n.protein_g ?? 0) * 4 + (n.fat_g ?? 0) * 9
      );
    return {
      basis: "por 100 g",
      carbs: n.carbs_g ?? 0,
      prot: n.protein_g ?? 0,
      fat: n.fat_g ?? 0,
      kcal,
    };
  }

  // quando escolher um item, já preenche gramas com a porção (se souber)
  function handleSelectItem(item: FoodItem) {
    setSelected(item);
    if (item.serving?.grams) setGrams(String(Math.round(item.serving.grams)));
    else setGrams("100");
  }

  return (
    <View style={styles.containerOuter}>
      {/* Botão "Fit" */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 100,
          right: 15,
          backgroundColor: "#000",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#0057C9",
          paddingHorizontal: 12,
          paddingVertical: 6,
          zIndex: 10,
        }}
        onPress={() => router.push("/fit")}
      >
        <Ionicons name="barbell-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Macronutrientes</Text>

        <View style={styles.donutsCardContainer}>
          <View style={styles.donutRow}>
            {data.map((d, i) => (
              <Donut
                key={i}
                value={d.value}
                color={d.color}
                label={d.label}
                totalMacros={totalMacros}
                isCalorie={(d as any).isCalorie}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Alimentação</Text>
        {mealsState.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>{meal.name}</Text>
              {meal.items ? (
                <Text style={styles.mealItems}>{meal.items}</Text>
              ) : (
                <Text
                  style={[
                    styles.mealItems,
                    { fontStyle: "italic", color: "#888" },
                  ]}
                >
                  Nenhum alimento adicionado
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFood(meal)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { marginLeft: 8, backgroundColor: "#FF4C4C" },
                ]}
                onPress={() => openCustomModal(meal)}
                disabled={!meal.items}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Adicionar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Adicionar alimento
            </Text>

            {/* Busca */}
            <View style={[styles.searchContainer, { marginBottom: 8 }]}>
              <MaterialIcons name="search" size={20} color="#0057C9" />
              <TextInput
                style={[
                  styles.modalInput,
                  { borderWidth: 0, marginVertical: 0, paddingVertical: 8 },
                ]}
                placeholder="Buscar alimento"
                placeholderTextColor="#8ba7c4"
                value={q}
                onChangeText={setQ}
              />
            </View>

            {/* Resultados */}
            {error ? <Text style={{ color: "#ff6b6b" }}>{error}</Text> : null}
            <View style={{ maxHeight: 220 }}>
              {loading && results.length === 0 ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(i) => i.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectItem(item)}
                      style={{
                        flexDirection: "row",
                        paddingVertical: 8,
                        borderBottomColor: "#1f2a37",
                        borderBottomWidth: 1,
                      }}
                    >
                      {item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            marginRight: 8,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            marginRight: 8,
                            backgroundColor: "#0b1220",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>🍎</Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          {item.name}
                        </Text>
                        {!!item.brand && (
                          <Text style={{ color: "#8ba7c4", fontSize: 12 }}>
                            {item.brand}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  onEndReached={() =>
                    !loading && hasMore && setPage((p) => p + 1)
                  }
                  onEndReachedThreshold={0.4}
                />
              )}
            </View>

            {/* Selecionado + porção */}
            {selected && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "#8ba7c4", marginBottom: 6 }}>
                  {selected.name}
                </Text>

                {/* Base do item: por porção se existir; senão 100 g */}
                {(() => {
                  const d = deriveDisplayNutrients(selected);
                  return (
                    <Text style={{ color: "#8ba7c4", fontSize: 12 }}>
                      {d.basis} — Carb {round1(d.carbs)} g • Prot{" "}
                      {round1(d.prot)} g • Gord {round1(d.fat)} g • {d.kcal}{" "}
                      kcal
                    </Text>
                  );
                })()}

                {/* Quick actions de porção quando soubermos a gramagem */}
                {selected.serving?.grams ? (
                  <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                    {[0.5, 1, 2].map((mult) => (
                      <TouchableOpacity
                        key={mult}
                        onPress={() =>
                          setGrams(
                            String(Math.round(selected.serving!.grams! * mult))
                          )
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#0057C9",
                          borderRadius: 999,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                        }}
                      >
                        <Text style={{ color: "#fff" }}>
                          {mult === 0.5
                            ? "½ porção"
                            : mult === 1
                            ? "1 porção"
                            : "2 porções"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                <Text style={{ color: "#8ba7c4", marginTop: 10 }}>
                  Porção (g)
                </Text>
                <TextInput
                  value={grams}
                  onChangeText={(t) => setGrams(t.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  style={styles.modalInput}
                  placeholder="100"
                  placeholderTextColor="#8ba7c4"
                />

                {Number(grams) > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 6,
                    }}
                  >
                    {(() => {
                      const m = macrosForServing(
                        selected.nutrientsPer100g,
                        Number(grams)
                      );
                      return (
                        <>
                          <Pill label="Carb" value={m.carbs_g} unit="g" />
                          <Pill label="Prot" value={m.protein_g} unit="g" />
                          <Pill label="Gord" value={m.fat_g} unit="g" />
                          <Pill label="KCal" value={m.kcal} unit="kcal" />
                        </>
                      );
                    })()}
                  </View>
                )}
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              <Button
                title="Cancelar"
                color="#FF4C4C"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Adicionar"
                onPress={addSelectedToMeal}
                disabled={!selected || !(Number(grams) > 0)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Remover */}
      <Modal
        visible={customModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Remover alimento
            </Text>
            {selectedMealForCustom &&
              selectedMealForCustom.items.split(", ").map((food: string) => (
                <TouchableOpacity
                  key={food}
                  onPress={() => removeFoodFromMeal(food)}
                >
                  <Text style={{ fontSize: 16, padding: 5, color: "#fff" }}>
                    {food} ❌
                  </Text>
                </TouchableOpacity>
              ))}
            <Button
              title="Fechar"
              onPress={() => setCustomModalVisible(false)}
              color="#FF4C4C"
            />
          </View>
        </View>
      </Modal>

      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    textAlign: "center",
    color: "#0057C9",
  },
  donutsCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  donutRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  donutContainer: { alignItems: "center", margin: 10, width: 120 },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0057C9",
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 16,
  },
  mealCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#0057C9",
  },
  mealTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  mealItems: { color: "#aaa", fontSize: 14, marginTop: 4 },
  addButton: {
    backgroundColor: "#0057C9",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dietCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  dietCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#36A2EB",
    marginBottom: 8,
  },
  dietCardItem: { fontSize: 14, color: "#fff", marginBottom: 4 },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 40,
    left: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 20,
    borderColor: "#5692B7",
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#000",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 8,
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#000",
    color: "#fff",
  },
});
