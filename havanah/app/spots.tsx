import { View, Text, StyleSheet } from 'react-native';
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";

export default function SpotsScreen() {
  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.title}> SPOTS </Text>
      <View style={styles.map}>
              <CarteSpots />
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: "center", fontSize: 20, marginBottom: 10, marginTop: 30, fontWeight: "bold" },
  map: { width: "100%", height: "90%" }
})