// app/fit.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  TextInput, Button, Platform, PermissionsAndroid, Alert, NativeModules
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { BleManager, Device, Characteristic } from "react-native-ble-plx";

// 🔹 Importa Google Fit
import GoogleFit, { Scopes } from "react-native-google-fit";

/* ====================== Utils: Base64 ====================== */
const atobSafe = (b64: string) => {
  if (typeof globalThis.atob === "function") return globalThis.atob(b64);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = "", i = 0;
  b64 = b64.replace(/[^A-Za-z0-9+/=]/g, "");
  while (i < b64.length) {
    const e1 = chars.indexOf(b64[i++]);
    const e2 = chars.indexOf(b64[i++]);
    const e3 = chars.indexOf(b64[i++]);
    const e4 = chars.indexOf(b64[i++]);
    const c1 = (e1 << 2) | (e2 >> 4);
    const c2 = ((e2 & 15) << 4) | (e3 >> 2);
    const c3 = ((e3 & 3) << 6) | e4;
    str += String.fromCharCode(c1);
    if (e3 !== 64) str += String.fromCharCode(c2);
    if (e4 !== 64) str += String.fromCharCode(c3);
  }
  return str;
};
const b64ToBytes = (b64: string) => {
  const bin = atobSafe(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

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
type Exercise = { id: string; name: string; sets: number; reps: number };
const HR_SERVICE = "180D";
const HR_MEAS_CHAR = "2A37";

/* ====================== Componente ====================== */
export default function Fit() {
  // treino (visual igual home)
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Supino reto", sets: 4, reps: 10 },
    { id: "2", name: "Agachamento", sets: 4, reps: 8 },
  ]);
  const weeklyGoal = 5;
  const completed = useMemo(() => Math.min(weeklyGoal, Math.ceil(exercises.length / 2)), [exercises.length]);
  const cardioGoal = 30, cardioDone = 18;
  const strengthGoal = 20;
  const strengthDone = exercises.reduce((acc, e) => acc + e.sets, 0);

  // 🔹 Estado de calorias vindas do Google Fit
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  // modal add exercício
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(""), [sets, setSets] = useState("3"), [reps, setReps] = useState("10");
  const openAdd = () => { setName(""); setSets("3"); setReps("10"); setModalVisible(true); };
  const addExercise = () => {
    const s = Number(sets), r = Number(reps);
    if (!name.trim() || !Number.isFinite(s) || s <= 0 || !Number.isFinite(r) || r <= 0) return;
    setExercises(prev => [{ id: Math.random().toString(36).slice(2), name: name.trim(), sets: s, reps: r }, ...prev]);
    setModalVisible(false);
  };
  const removeExercise = (id: string) => setExercises(prev => prev.filter(e => e.id !== id));

  /* ====================== Google Fit ====================== */
  useEffect(() => {
    const initGoogleFit = async () => {
      if (!GoogleFit) return;

      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
        ],
      };

      try {
        const authResult = await GoogleFit.authorize(options);
        if (authResult.success) {
          console.log("Google Fit autorizado ✅");
          await loadCalories();
        } else {
          console.warn("Google Fit não autorizado:", authResult.message);
        }
      } catch (e) {
        console.error("Erro ao autorizar Google Fit:", e);
      }
    };

    initGoogleFit();
  }, []);

  const loadCalories = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    try {
      const res = await GoogleFit.getDailyCalorieSamples({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        basalCalculation: true,
      });
      if (res.length) {
        const today = res.find(r => r.startDate.includes(start.toISOString().split("T")[0]));
        setCaloriesBurned(today?.calorie ?? 0);
      }
    } catch (e) {
      console.error("Erro ao buscar calorias:", e);
    }
  };

  /* ====================== BLE ====================== */
  const isBleNativeAvailable = !!(NativeModules as any).BleClientManager;
  const managerRef = useRef<BleManager | null>(null);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const hrSubscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isBleNativeAvailable) {
      managerRef.current = new BleManager();
    }
    return () => {
      try { hrSubscriptionRef.current?.(); } catch {}
      try { managerRef.current?.destroy(); } catch {}
    };
  }, []);

  const requestPermsAndroid = async () => {
    if (Platform.OS !== "android") return true;
    const PERM: any = (PermissionsAndroid as any).PERMISSIONS;
    const RESULTS: any = (PermissionsAndroid as any).RESULTS;
    const perms = [
      PERM?.ACCESS_FINE_LOCATION,
      PERM?.BLUETOOTH_SCAN,
      PERM?.BLUETOOTH_CONNECT,
    ].filter(Boolean);
    const res = await PermissionsAndroid.requestMultiple(perms);
    return Object.values(res).every((v) => v === RESULTS.GRANTED);
  };

  const parseHr = (c: Characteristic) => {
    if (!c?.value) return;
    const bytes = b64ToBytes(c.value);
    const flags = bytes[0] ?? 0;
    const hr = (flags & 0x01) ? (bytes[1] | (bytes[2] << 8)) : bytes[1];
    if (Number.isFinite(hr)) setHeartRate(hr);
  };

  /* ====================== JSX ====================== */
  return (
    <View style={styles.containerOuter}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Fitness</Text>

        <View style={styles.donutsCardContainer}>
          <View style={styles.donutRow}>
            <Donut value={completed} total={weeklyGoal} color="#36A2EB" label="Meta Semanal" suffix="" />
            <Donut value={cardioDone} total={cardioGoal} color="#4BC0C0" label="Cardio (min)" suffix="m" />
            <Donut value={strengthDone} total={strengthGoal} color="#FF6384" label="Séries Força" suffix="" />
            <Donut value={caloriesBurned} total={500} color="#FFA500" label="Calorias" suffix=" kcal" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Smartwatch (BLE)</Text>
        <View style={styles.mealCard}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Frequência Cardíaca</Text>
            <Text style={{ color: "#aaa", marginTop: 6 }}>
              {heartRate ? `${heartRate} bpm` : (isBleNativeAvailable ? "Sem leitura" : "Indisponível no Expo Go")}
            </Text>
          </View>
        </View>
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
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0057C9", marginTop: 30, marginBottom: 10, marginLeft: 16 },
  mealCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginBottom: 12, marginHorizontal: 16,
    borderWidth: 1, borderColor: "#0057C9",
  },
  addButton: { backgroundColor: "#0057C9", borderRadius: 30, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#000", borderRadius: 12, padding: 16, borderColor: "#5692B7", borderWidth: 1 },
  modalInput: { borderWidth: 1, borderColor: "#0057C9", borderRadius: 8, marginVertical: 8, padding: 8, backgroundColor: "#000", color: "#fff" },
});
