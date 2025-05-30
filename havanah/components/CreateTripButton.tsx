// components/CreateTripButton.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CreateTripButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Créer un itinéraire</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF9900",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
