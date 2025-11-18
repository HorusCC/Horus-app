// app/Fit.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  RefreshControl,
  NativeModules,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise, CardioExercise, StrengthExercise } from "../types/exercise";
import { useSmartwatchCalories } from "../hooks/useSmartwatchCalories";

export default function Fit() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "c1", name: "Cardio", type: "cardio", minutes: 30 },
    {
      id: "m1",
      name: "Musculação",
      type: "strength",
      sets: 4,
      reps: 12,
      minutes: 40,
    },
  ]);
  console.log("NativeModules:", NativeModules);

  const weeklyGoal = 5;
  const completed = useMemo(
    () => Math.min(weeklyGoal, Math.ceil(exercises.length / 2)),
    [exercises.length]
  );

  const cardioGoal = 60;
  const cardioDone = useMemo(
    () =>
      exercises
        .filter((e) => e.type === "cardio")
        .reduce((acc, e) => acc + e.minutes, 0),
    [exercises]
  );

  const strengthDone = useMemo(
    () =>
      exercises
        .filter((e) => e.type === "strength")
        .reduce((acc, e) => acc + e.sets, 0),
    [exercises]
  );

  // 👉 AGORA: dados vindos do Health Connect (Google Fit / Zepp / etc)
  const { calories, steps, loading, error, refresh } = useSmartwatchCalories();

  // já carrega no primeiro render (hook faz isso, então aqui é opcional)
  useEffect(() => {
    refresh();
  }, [refresh]);

  const caloriesDisplay = useMemo(
    () => (Number.isFinite(calories) ? Math.round(calories) : 0),
    [calories]
  );
  const stepsDisplay = useMemo(
    () => (Number.isFinite(steps) ? Math.round(steps) : 0),
    [steps]
  );
  const stepsGoal = 8000;

  // Modal de novo exercício
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<"cardio" | "strength">("cardio");
  const [name, setName] = useState("Cardio");
  const [minutes, setMinutes] = useState("30");
  const [sets, setSets] = useState("4");
  const [reps, setReps] = useState("12");

  const openAdd = (preset?: "cardio" | "strength") => {
    const cat = preset ?? "cardio";
    setCategory(cat);
    setName(cat === "cardio" ? "Cardio" : "Musculação");
    setMinutes("30");
    setSets("4");
    setReps("12");
    setModalVisible(true);
  };

  const addExercise = () => {
    if (category === "cardio") {
      const m = Number(minutes);
      if (!name.trim() || !Number.isFinite(m) || m <= 0) return;
      const ex: CardioExercise = {
        id: Math.random().toString(36).slice(2),
        name: name.trim(),
        type: "cardio",
        minutes: m,
      };
      setExercises((prev) => [ex, ...prev]);
    } else {
      const s = Number(sets);
      const r = Number(reps);
      const m = Number(minutes) || undefined;
      if (
        !name.trim() ||
        !Number.isFinite(s) ||
        s <= 0 ||
        !Number.isFinite(r) ||
        r <= 0
      )
        return;
      const ex: StrengthExercise = {
        id: Math.random().toString(36).slice(2),
        name: name.trim(),
        type: "strength",
        sets: s,
        reps: r,
        minutes: m,
      };
      setExercises((prev) => [ex, ...prev]);
    }
    setModalVisible(false);
  };

  const removeExercise = (id: string) =>
    setExercises((prev) => prev.filter((e) => e.id !== id));

  const cardio = exercises.filter((e) => e.type === "cardio");
  const strength = exercises.filter((e) => e.type === "strength");

  return (
    <View style={styles.containerOuter}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#fff"
          />
        }
      >
        <Text style={styles.title}>Fitness</Text>

        {/* Card principal com meta semanal + métricas */}
        <View style={styles.mainCard}>
          <View style={styles.weekSummaryRow}>
            <View style={styles.weekChip}>
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.weekChipText}>
                Semana: {completed}/{weeklyGoal} treinos
              </Text>
            </View>
            <Text style={styles.smallHint}>Continue se movimentando 🔥</Text>
          </View>

          <View style={styles.metricsRow}>
            {/* Passos (👣) */}
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>👣</Text>
              <Text style={styles.metricLabel}>Passos</Text>
              <Text style={styles.metricValue}>
                {loading
                  ? "..."
                  : error
                  ? "--"
                  : stepsDisplay.toLocaleString("pt-BR")}
              </Text>
              <Text style={styles.metricSub}>
                {loading
                  ? "Sincronizando Health Connect"
                  : error
                  ? "Não foi possível ler os passos"
                  : `Meta ${stepsGoal.toLocaleString("pt-BR")} passos`}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        (stepsDisplay / stepsGoal) * 100 || 0
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Calorias (🔥) */}
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🔥</Text>
              <Text style={styles.metricLabel}>Calorias</Text>
              <Text style={styles.metricValue}>
                {loading ? "..." : error ? "--" : `${caloriesDisplay} kcal`}
              </Text>
              <Text style={styles.metricSub}>
                {loading
                  ? "Sincronizando Health Connect"
                  : error
                  ? "Não foi possível ler as calorias"
                  : "Meta 500 kcal"}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFillCalories,
                    {
                      width: `${Math.min(
                        100,
                        (caloriesDisplay / 500) * 100 || 0
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Cardio */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="walk-outline" size={20} color="#4BC0C0" />
            <Text style={styles.sectionTitle}>Cardio (minutos)</Text>
          </View>
          <TouchableOpacity
            onPress={() => openAdd("cardio")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 8 }}>
          <Text style={styles.sectionBadge}>
            {cardioDone} / {cardioGoal} min de cardio nesta semana
          </Text>

          {cardio.map((e) => (
            <View key={e.id} style={styles.exerciseItem}>
              <View>
                <Text style={styles.exerciseName}>{e.name}</Text>
                <Text style={styles.exerciseMeta}>{e.minutes} min</Text>
              </View>
              <TouchableOpacity onPress={() => removeExercise(e.id)}>
                <Ionicons name="trash" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ))}
          {cardio.length === 0 && (
            <Text style={styles.emptyText}>Nenhuma atividade de cardio</Text>
          )}
        </View>

        {/* Musculação */}
        <View style={[styles.sectionHeaderRow, { marginTop: 26 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="barbell-outline" size={20} color="#9B59B6" />
            <Text style={styles.sectionTitle}>
              Musculação (séries x repetições)
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => openAdd("strength")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 8 }}>
          <Text style={styles.sectionBadge}>
            {strengthDone} séries registradas
          </Text>

          {strength.map((e) => (
            <View key={e.id} style={styles.exerciseItem}>
              <View>
                <Text style={styles.exerciseName}>{e.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {e.sets} x {e.reps}
                  {e.minutes ? `  ·  ${e.minutes} min` : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeExercise(e.id)}>
                <Ionicons name="trash" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ))}
          {strength.length === 0 && (
            <Text style={styles.emptyText}>Nenhum exercício de musculação</Text>
          )}
        </View>

        {/* Modal de novo exercício */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Novo exercício</Text>

              <View style={styles.catRow}>
                <TouchableOpacity
                  onPress={() => setCategory("cardio")}
                  style={[
                    styles.catButton,
                    category === "cardio" && styles.catButtonActive,
                  ]}
                >
                  <Text style={styles.catButtonText}>Cardio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCategory("strength")}
                  style={[
                    styles.catButton,
                    category === "strength" && styles.catButtonActive,
                  ]}
                >
                  <Text style={styles.catButtonText}>Musculação</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder={
                  category === "cardio" ? "Nome (Cardio)" : "Nome (ex: Supino)"
                }
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                style={styles.modalInput}
              />

              {category === "cardio" ? (
                <TextInput
                  placeholder="Minutos (ex: 30)"
                  placeholderTextColor="#888"
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="numeric"
                  style={styles.modalInput}
                />
              ) : (
                <>
                  <TextInput
                    placeholder="Séries (ex: 4)"
                    placeholderTextColor="#888"
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="numeric"
                    style={styles.modalInput}
                  />
                  <TextInput
                    placeholder="Repetições (ex: 12)"
                    placeholderTextColor="#888"
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    style={styles.modalInput}
                  />
                  <TextInput
                    placeholder="Minutos (opcional)"
                    placeholderTextColor="#888"
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType="numeric"
                    style={styles.modalInput}
                  />
                </>
              )}

              <View style={styles.modalButtonsRow}>
                <Button
                  title="Cancelar"
                  onPress={() => setModalVisible(false)}
                  color="#888"
                />
                <Button title="Adicionar" onPress={addExercise} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  mainCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  weekSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  weekChip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    backgroundColor: "rgba(0,87,201,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  weekChipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  smallHint: {
    color: "#aaa",
    fontSize: 12,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    columnGap: 12,
  },

  metricCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  metricIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  metricLabel: {
    color: "#aaa",
    fontSize: 13,
  },

  metricValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },

  metricSub: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },

  progressBarBackground: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#4BC0C0",
  },

  progressBarFillCalories: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFA500",
  },

  errorText: {
    marginTop: 8,
    color: "#ff6b6b",
    fontSize: 12,
    textAlign: "center",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },

  sectionBadge: {
    color: "#4BC0C0",
    fontSize: 12,
    marginBottom: 6,
  },

  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  exerciseName: { color: "#fff", fontSize: 16, fontWeight: "600" },

  exerciseMeta: { color: "#aaa", marginTop: 2 },

  addButton: {
    backgroundColor: "#0057C9",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#05070b",
    borderRadius: 12,
    padding: 16,
    borderColor: "#5692B7",
    borderWidth: 1,
  },

  modalTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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

  catRow: {
    flexDirection: "row",
    columnGap: 8,
    marginTop: 10,
    marginBottom: 4,
  },

  catButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: "#0057C9",
    borderWidth: 1,
    alignItems: "center",
  },

  catButtonActive: { backgroundColor: "rgba(0,87,201,0.5)" },

  catButtonText: {
    color: "#fff",
    fontWeight: "500",
  },

  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8,
    marginTop: 8,
  },
});
