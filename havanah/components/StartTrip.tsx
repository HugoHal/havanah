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
    backgroundColor: "#AD1328",
    width: 70,
    height: 70,
    borderRadius: 35, // moitié de width/height pour un cercle
    alignItems: "center",
    justifyContent: "center", // centre le texte verticalement
    margin: 10,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14, // tu peux réduire un peu la taille si besoin
    textAlign: "center",
  },
});