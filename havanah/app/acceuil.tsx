import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";

export default function AccueilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur HAVANAH 🏕️</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
      <Text style={styles.title}>Explorez les meilleurs spots de camping !</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un spot..." />
      <Text style={styles.title}>Les populaires</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", gap: 1 }}>
      <TouchableOpacity style={styles.btnLarge}>
        <Text style={styles.text}>semaine</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLarge}>
        <Text style={styles.text}>mois</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLarge}>
        <Text style={styles.text}>année</Text>
      </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  btnSmall: {
    backgroundColor: "#34573E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  btnMedium: {
    backgroundColor: "#FF9900",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 10,
  },
  btnLarge: {
    backgroundColor: "#D4C1A7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flex: 1
  },
  title: { textAlign: "center", fontSize: 18, marginBottom: 10 },
  map: { width: "100%", height: 200 },
});
