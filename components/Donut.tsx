import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

type Props = {
  value: number;
  total?: number;
  color: string;
  label: string;
  suffix?: string;
};

export default function Donut({ value, total = 100, color, label, suffix = "%" }: Props) {
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
}

const styles = StyleSheet.create({
  donutContainer: { alignItems: "center", margin: 10, width: 120 },
  donutLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4, color: "#fff" },
  donutName: { fontSize: 14, color: "#fff", marginTop: 2 },
});
