import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FoodItem, searchFoodsByName } from "../../src/services/openFoodFacts";

export default function SearchConsultOnly() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // debounce
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setPage(1);
    setItems([]);
    setError(null);
  }, [debounced]);

  useEffect(() => {
    if (!debounced) {
      setItems([]);
      setHasMore(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    (async () => {
      try {
        setLoading(true);
        const { items: chunk, pageCount } = await searchFoodsByName(
          debounced,
          page,
          24,
          controller.signal
        );
        setItems((prev) => (page === 1 ? chunk : [...prev, ...chunk]));
        setHasMore(page < pageCount);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Erro ao buscar");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debounced, page]);

  const onEnd = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const d = deriveDisplayNutrients(item);
    return (
      <View style={styles.card}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.imgPlaceholder]}>
            <Text>🍎</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          {!!item.brand && <Text style={styles.brand}>{item.brand}</Text>}
          <Text style={styles.basisText}>{d.basis}</Text>
          <View style={styles.macrosRow}>
            <Pill label="Carb" value={round1(d.carbs)} unit="g" />
            <Pill label="Prot" value={round1(d.prot)} unit="g" />
            <Pill label="Gord" value={round1(d.fat)} unit="g" />
            <Pill label="KCal" value={d.kcal} unit="kcal" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/horusNew.png")}
        style={styles.logo}
        accessibilityLabel="Logo Horus"
      />
      <Text style={styles.header}>Pesquise seu Alimento</Text>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#0057C9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por alimento"
          placeholderTextColor="#5692B7"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {error && (
        <Text style={{ color: "#ff6b6b", marginBottom: 8 }}>{error}</Text>
      )}

      {loading && items.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          onEndReached={onEnd}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            debounced ? (
              <Text
                style={{ color: "#8ba7c4", textAlign: "center", marginTop: 12 }}
              >
                Nenhum resultado.
              </Text>
            ) : null
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ marginVertical: 12 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

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
    const factor = item.serving.grams / 100;
    const n = item.nutrientsPer100g;
    const carbs = (n.carbs_g ?? 0) * factor;
    const prot = (n.protein_g ?? 0) * factor;
    const fat = (n.fat_g ?? 0) * factor;
    const kcal =
      n.kcal != null
        ? Math.round(n.kcal * factor)
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

function Pill({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <View style={styles.pill}>
      <Text style={{ color: "#0F172A", fontSize: 12 }}>
        {label}: <Text style={{ fontWeight: "700" }}>{value}</Text> {unit}
      </Text>
    </View>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    top: 10,
    left: 20,
    marginTop: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057C9",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0057C9",
    borderRadius: 25,
    paddingHorizontal: 12,
    backgroundColor: "#000",
    marginBottom: 10,
  },
  searchInput: { flex: 1, height: 45, marginLeft: 8, color: "#fff" },

  card: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomColor: "#1f2a37",
    borderBottomWidth: 1,
  },
  img: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  imgPlaceholder: {
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontWeight: "700" },
  brand: { color: "#8ba7c4", fontSize: 12, marginTop: 2 },
  basisText: { color: "#8ba7c4", fontSize: 12, marginTop: 4 },
  macrosRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  pill: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
});
