// app/fit.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  TextInput, Button, RefreshControl
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

/* ====================== URL/TOKEN via Expo extra ====================== */
const { API_URL, API_TOKEN } = (Constants.expoConfig?.extra ?? {}) as {
  API_URL?: string;
  API_TOKEN?: string;
};
const SMARTWATCH_API_URL = API_URL || "http://localhost:3001";
const SMARTWATCH_TOKEN = API_TOKEN || "dev-token-qualquer";

/* ====================== UI: Donut ====================== */
const Donut = ({
  value, total = 100, color, label, suffix = "%",
}: { value: number; total?: number; color: string; label: string; suffix?: string }) => {
  const radius = 50, strokeWidth = 14;
  const pct = total <= 0 ? 0 : Math.min(100, Math.max(0, (value / total) * 100));
  const circumference = 2 * Math.PI * radius;
  return (
    <View style={styles.donutContainer}>
      <Svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2}>
        <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
          <Circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} stroke="#2d2d2d" strokeWidth={strokeWidth} fill="transparent" />
          <Circle
            cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius}
            stroke={color} strokeWidth={strokeWidth} fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - (circumference * pct) / 100}
            strokeLinecap="round"
          />
        </G>
        <SvgText x={radius + strokeWidth} y={radius + strokeWidth + 5} fontSize="16" fontWeight="bold" fill={color} textAnchor="middle">
          {Math.round(pct)}%
        </SvgText>
      </Svg>
      <Text style={[styles.donutLabel, { color }]}>{Math.round(value)}{suffix}</Text>
      <Text style={styles.donutName}>{label}</Text>
    </View>
  );
};

/* ====================== Tipos & Constantes ====================== */
export type ExerciseBase = { id: string; name: string; type: 'cardio' | 'strength' };
export type CardioExercise = ExerciseBase & { type: 'cardio'; minutes: number };
export type StrengthExercise = ExerciseBase & { type: 'strength'; sets: number; reps: number; minutes?: number };
export type Exercise = CardioExercise | StrengthExercise;

/* ====================== Componente ====================== */
export default function Fit() {
  // Seeds
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 'c1', name: 'Cardio', type: 'cardio', minutes: 30 },
    { id: 'm1', name: 'Musculação', type: 'strength', sets: 4, reps: 12, minutes: 40 },
  ]);

  // Metas (exemplo)
  const weeklyGoal = 5;
  const completed = useMemo(() => Math.min(weeklyGoal, Math.ceil(exercises.length / 2)), [exercises.length]);
  const cardioGoal = 60; // minutos/dia
  const cardioDone = useMemo(
    () => exercises.filter(e => e.type === 'cardio').reduce((acc, e) => acc + e.minutes, 0),
    [exercises]
  );
  const strengthGoal = 20; // séries
  const strengthDone = useMemo(
    () => exercises.filter(e => e.type === 'strength').reduce((acc, e) => acc + e.sets, 0),
    [exercises]
  );

  // Calorias vindas do Smartwatch (API)
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchCaloriesFromSmartwatch().catch(console.error); }, []);

  async function fetchCaloriesFromSmartwatch(retry = 1) {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const url = `${SMARTWATCH_API_URL}/metrics/daily?date=${today}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${SMARTWATCH_TOKEN}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCaloriesBurned(Number(data.calories) || 0);
    } catch (e) {
      console.error('Erro ao buscar calorias do smartwatch:', e);
      if (retry > 0) setTimeout(() => fetchCaloriesFromSmartwatch(retry - 1), 800);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCaloriesFromSmartwatch(0);
    setRefreshing(false);
  };

  // Estado do modal (adicionar exercício)
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState<'cardio' | 'strength'>('cardio');
  const [name, setName] = useState('Cardio');
  const [minutes, setMinutes] = useState('30');
  const [sets, setSets] = useState('4');
  const [reps, setReps] = useState('12');

  const openAdd = (preset?: 'cardio' | 'strength') => {
    const cat = preset ?? 'cardio';
    setCategory(cat);
    setName(cat === 'cardio' ? 'Cardio' : 'Musculação');
    setMinutes('30'); setSets('4'); setReps('12');
    setModalVisible(true);
  };

  const addExercise = () => {
    if (category === 'cardio') {
      const m = Number(minutes);
      if (!name.trim() || !Number.isFinite(m) || m <= 0) return;
      const ex: CardioExercise = { id: Math.random().toString(36).slice(2), name: name.trim(), type: 'cardio', minutes: m };
      setExercises(prev => [ex, ...prev]);
    } else {
      const s = Number(sets), r = Number(reps); const m = Number(minutes) || undefined;
      if (!name.trim() || !Number.isFinite(s) || s <= 0 || !Number.isFinite(r) || r <= 0) return;
      const ex: StrengthExercise = { id: Math.random().toString(36).slice(2), name: name.trim(), type: 'strength', sets: s, reps: r, minutes: m };
      setExercises(prev => [ex, ...prev]);
    }
    setModalVisible(false);
  };

  const removeExercise = (id: string) => setExercises(prev => prev.filter(e => e.id !== id));

  const cardio = exercises.filter(e => e.type === 'cardio');
  const strength = exercises.filter(e => e.type === 'strength');

  return (
    <View style={styles.containerOuter}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        <Text style={styles.title}>Fitness</Text>

        <View style={styles.donutsCardContainer}>
          <View style={styles.donutRow}>
            <Donut value={completed} total={weeklyGoal} color="#36A2EB" label="Meta Semanal" suffix="" />
            <Donut value={cardioDone} total={cardioGoal} color="#4BC0C0" label="Cardio (min)" suffix="m" />
            <Donut value={strengthDone} total={strengthGoal} color="#FF6384" label="Séries Força" suffix="" />
            <Donut value={caloriesBurned} total={500} color="#FFA500" label="Calorias (watch)" suffix=" kcal" />
          </View>
        </View>

        {/* Cardio */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Cardio (minutos)</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => openAdd('cardio')} style={styles.addButton}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 8 }}>
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
            <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 12 }}>Nenhuma atividade de cardio</Text>
          )}
        </View>

        {/* Musculação */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 26 }}>
          <Text style={styles.sectionTitle}>Musculação (séries x repetições)</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => openAdd('strength')} style={styles.addButton}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 8 }}>
          {strength.map((e) => (
            <View key={e.id} style={styles.exerciseItem}>
              <View>
                <Text style={styles.exerciseName}>{e.name}</Text>
                <Text style={styles.exerciseMeta}>{e.sets} x {e.reps}{e.minutes ? `  ·  ${e.minutes} min` : ''}</Text>
              </View>
              <TouchableOpacity onPress={() => removeExercise(e.id)}>
                <Ionicons name="trash" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ))}
          {strength.length === 0 && (
            <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 12 }}>Nenhum exercício de musculação</Text>
          )}
        </View>

        {/* Modal */}
        <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Novo exercício</Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 4 }}>
                <TouchableOpacity onPress={() => setCategory('cardio')} style={[styles.catButton, category === 'cardio' && styles.catButtonActive]}>
                  <Text style={{ color: '#fff' }}>Cardio</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCategory('strength')} style={[styles.catButton, category === 'strength' && styles.catButtonActive]}>
                  <Text style={{ color: '#fff' }}>Musculação</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder={category === 'cardio' ? 'Nome (Cardio)' : 'Nome (ex: Supino)'}
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                style={styles.modalInput}
              />

              {category === 'cardio' ? (
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

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Adicionar" onPress={addExercise} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

/* ====================== Estilos ====================== */
const styles = StyleSheet.create({
  containerOuter: { flex: 1, backgroundColor: "#000" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 60, marginBottom: 20, textAlign: "center", color: "#0057C9" },
  donutsCardContainer: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, marginHorizontal: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  donutRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", width: "100%" },
  donutContainer: { alignItems: "center", margin: 10, width: 120 },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4, color: "#fff" },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0057C9", marginTop: 0, marginBottom: 10 },
  exerciseItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  exerciseName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  exerciseMeta: { color: '#aaa', marginTop: 2 },
  addButton: { backgroundColor: "#0057C9", borderRadius: 30, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#000", borderRadius: 12, padding: 16, borderColor: "#5692B7", borderWidth: 1 },
  modalInput: { borderWidth: 1, borderColor: "#0057C9", borderRadius: 8, marginVertical: 8, padding: 8, backgroundColor: "#000", color: "#fff" },
  catButton: { backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderColor: '#0057C9', borderWidth: 1 },
  catButtonActive: { backgroundColor: 'rgba(0,87,201,0.5)' },
});
