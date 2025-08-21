import { View } from "react-native";
import { Redirect } from "expo-router";

export default function DiaryPage() {
  return (
    <View>
      <Redirect href="/searchFood" />
    </View>
  );
}
