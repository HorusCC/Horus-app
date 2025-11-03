// app/(tabs)/home.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useMacro } from "@/app/contexts/MacroContext";
import { searchFoodsByName, FoodItem } from "@/src/services/openFoodFacts";
import { macrosForServing, round1 } from "@/src/utils/nutrition";

type MealItem = {
  id: string;
  label: string;
  grams: number;
  macros: { carbs_g: number; protein_g: number; fat_g: number; kcal: number };
};
type Meal = { id: string; name: string; items: MealItem[] };

const initialMeals: Meal[] = [
  { id: "1", name: "Café da Manhã", items: [] },
  { id: "2", name: "Lanche da Manhã", items: [] },
  { id: "3", name: "Almoço", items: [] },
  { id: "4", name: "Café da Tarde", items: [] },
  { id: "5", name: "Jantar", items: [] },
];

export default function Home() {
  const router = useRouter();
  const { targets, consumed, remaining, addFood, removeFood } = useMacro();

  const [mealsState, setMealsState] = useState<Meal[]>(initialMeals);

  // modal adicionar alimento
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);

  // busca
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState(q);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // seleção/porção
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");

  // modal remover
  const [customModalVisible, setCustomModalVisible] = useState(false);

  // debounce
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 400);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    setPage(1);
    setResults([]);
    setError(null);
  }, [debounced]);

  // busca na API
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
        if (e?.name !== "AbortError")
          setError(e?.message ?? "Erro ao buscar alimentos");
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

    // mesmo id no contexto e na lista local
    const id = `${selected.id}-${Date.now()}`;

    // adiciona no contexto (conta para as barras)
    addFood({
      id,
      name: selected.name,
      grams: g,
      nutrientsPer100g: {
        carbs_g: selected.nutrientsPer100g?.carbs_g,
        protein_g: selected.nutrientsPer100g?.protein_g,
        fat_g: selected.nutrientsPer100g?.fat_g,
        kcal: selected.nutrientsPer100g?.kcal,
      },
    });

    // adiciona na refeição (UI)
    const portion = macrosForServing(selected.nutrientsPer100g || {}, g);
    const entry: MealItem = {
      id,
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

  const removeItem = (mealId: string, itemId: string) => {
    setMealsState((ms) =>
      ms.map((m) => {
        if (m.id !== mealId) return m;
        // remove do contexto (barras atualizam)
        removeFood(itemId);
        return { ...m, items: m.items.filter((i) => i.id !== itemId) };
      })
    );
  };

  // helper de exibição (por porção/100g)
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

  // calcula percentuais (defensivo)
  const pct = {
    carbs: targets?.carbs_g
      ? Math.min(100, (consumed.carbs_g / targets.carbs_g) * 100)
      : 0,
    prot: targets?.protein_g
      ? Math.min(100, (consumed.protein_g / targets.protein_g) * 100)
      : 0,
    fat: targets?.fat_g
      ? Math.min(100, (consumed.fat_g / targets.fat_g) * 100)
      : 0,
    kcal: targets?.calories
      ? Math.min(100, (consumed.calories / targets.calories) * 100)
      : 0,
  };

  return (
    <View style={styles.containerOuter}>
      {/* Botão "Fit" */}
      <TouchableOpacity
        style={styles.fitButton}
        onPress={() => router.push("/fit")}
      >
        <Ionicons name="barbell-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Macronutrientes</Text>

        {/* Card: quanto falta hoje (sem chips, só barras) */}
        {targets && remaining ? (
          <View style={styles.remainingCard}>
            <Text style={styles.remainingTitle}>Faltam hoje</Text>

            {/* Carboidrato */}
            <View style={styles.rowBetween}>
              <Text style={styles.macroLabel}>Carboidrato</Text>
              <Text style={styles.macroValue}>
                {`falta ${round1(remaining.carbs_g)} g`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct.carbs}%` }]} />
            </View>
            <Text style={styles.progressCaption}>
              {`consumido ${round1(consumed.carbs_g)} g / meta ${round1(
                targets.carbs_g
              )} g`}
            </Text>

            {/* Proteína */}
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Text style={styles.macroLabel}>Proteína</Text>
              <Text style={styles.macroValue}>
                {`falta ${round1(remaining.protein_g)} g`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct.prot}%` }]} />
            </View>
            <Text style={styles.progressCaption}>
              {`consumido ${round1(consumed.protein_g)} g / meta ${round1(
                targets.protein_g
              )} g`}
            </Text>

            {/* Gordura */}
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Text style={styles.macroLabel}>Gordura</Text>
              <Text style={styles.macroValue}>
                {`falta ${round1(remaining.fat_g)} g`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct.fat}%` }]} />
            </View>
            <Text style={styles.progressCaption}>
              {`consumido ${round1(consumed.fat_g)} g / meta ${round1(
                targets.fat_g
              )} g`}
            </Text>

            {/* Calorias */}
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Text style={styles.macroLabel}>Calorias</Text>
              <Text style={styles.macroValue}>
                {`falta ${round1(remaining.calories)} kcal`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct.kcal}%` }]} />
            </View>
            <Text style={styles.progressCaption}>
              {`consumido ${round1(consumed.calories)} kcal / meta ${round1(
                targets.calories
              )} kcal`}
            </Text>
          </View>
        ) : (
          <View
            style={{
              marginHorizontal: 16,
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#0057C9",
            }}
          >
            <Text style={{ color: "#fff" }}>
              Complete o cadastro para calcular suas metas diárias.
            </Text>
          </View>
        )}

        {/* Lista de refeições */}
        <Text style={styles.sectionTitle}>Alimentação</Text>
        {mealsState.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>{meal.name}</Text>
              {meal.items.length ? (
                <Text style={styles.mealItems}>
                  {meal.items.map((i) => `${i.label} (${i.grams}g)`).join(", ")}
                </Text>
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
              {/* ➕ abre o modal de adicionar com a busca */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => openAddModal(meal)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  { marginLeft: 8, backgroundColor: "#FF4C4C" },
                ]}
                onPress={() => openRemoveModal(meal)}
                disabled={!meal.items.length}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Adicionar (com busca) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Adicionar alimento {currentMeal ? `— ${currentMeal.name}` : ""}
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
                      onPress={() => {
                        setSelected(item);
                        if (item.serving?.grams)
                          setGrams(String(Math.round(item.serving.grams)));
                        else setGrams("100");
                      }}
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
                        selected.nutrientsPer100g || {},
                        Number(grams)
                      );
                      return (
                        <>
                          <InfoPill label="Carb" value={m.carbs_g} unit="g" />
                          <InfoPill label="Prot" value={m.protein_g} unit="g" />
                          <InfoPill label="Gord" value={m.fat_g} unit="g" />
                          <InfoPill label="Kcal" value={m.kcal} unit="kcal" />
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
      <Modal visible={customModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Remover alimento
            </Text>
            {currentMeal?.items.map((it) => (
              <TouchableOpacity
                key={it.id}
                onPress={() => removeItem(currentMeal!.id, it.id)}
              >
                <Text style={{ fontSize: 16, padding: 6, color: "#fff" }}>
                  {it.label} ({it.grams}g) ❌
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
        source={require("@/assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Horus Nutrition logo"
      />
    </View>
  );
}

function InfoPill({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#F1F5F9",
        marginRight: 8,
        marginBottom: 6,
      }}
    >
      <Text style={{ fontSize: 12, color: "#0F172A" }}>
        {label}: <Text style={{ fontWeight: "700" }}>{round1(value)}</Text>{" "}
        {unit}
      </Text>
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
  fitButton: {
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
  },

  // Card "Faltam hoje"
  remainingCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  remainingTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroLabel: { color: "#fff", fontWeight: "700" },
  macroValue: { color: "#fff" },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  progressCaption: {
    color: "#8ba7c4",
    fontSize: 12,
    marginTop: 4,
  },

  // Lista de refeições
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0057C9",
    marginTop: 24,
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
  mealTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  mealItems: { color: "#aaa", fontSize: 14, marginTop: 4 },
  addButton: {
    backgroundColor: "#0057C9",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Modal / busca
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
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
    marginVertical: 8,
    padding: 8,
    backgroundColor: "#000",
    color: "#fff",
  },

  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 40,
    left: 20,
  },
});
