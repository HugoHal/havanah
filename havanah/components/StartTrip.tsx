import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CreateTripButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Partir en Trip</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#34573E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
    height: 70 
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});