import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";
import CreateTripButton from "../components/CreateTripButton";
import StartTrip from "../components/StartTrip";

export default function AccueilScreen() {
  const handleCreateTrip = () => {
    console.log("Créer un itinéraire");
  };

  const handleStartTrip = () => {
    console.log("Démarrer un trip");
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur HAVANAH 🏕️</Text>
      <View style={styles.map}>
        <CarteSpots />
      </View>
      <Text style={styles.title}>Explorez les meilleurs spots de camping !</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un spot..." />
      <Text style={styles.title}>Les populaires</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", gap: 1 }}>
      <TouchableOpacity style={styles.btnPopu}>
        <Text style={styles.text}>semaine</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPopu}>
        <Text style={styles.text}>mois</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPopu}>
        <Text style={styles.text}>année</Text>
      </TouchableOpacity>
      </View>
      <CreateTripButton onPress={handleCreateTrip} />
      <StartTrip onPress={handleStartTrip}/>
    </View>
    </>
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
  btnPopu: {
    backgroundColor: "#D4C1A7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flex: 1
  },
  title: { textAlign: "center", fontSize: 20, marginBottom: 10, marginTop: 30, fontWeight: "bold" },
  map: { width: "100%", height: 200 },
});
