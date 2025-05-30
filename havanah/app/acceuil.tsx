import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";
import CreateTripButton from "../components/CreateTripButton";
import StartTrip from "../components/StartTrip";
import Logo from "../assets/images/logo.svg";

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
      <View style={styles.headerRow}>
        <Text style={styles.title}> HAVANAH </Text>
        <StartTrip onPress={handleStartTrip}/>
      </View>
      <View style={styles.mapContainer}>
        <CarteSpots />
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Rechercher un spot..."
          />
        </View>
      </View>
      <Text style={styles.subtitle}>Les populaires</Text>

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
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#D4C1A7",
  },
  mapContainer: {
    width: "102%",           
    height: 250,
    position: "relative",
    marginBottom: 10,
    alignSelf: "center",    // Centre horizontalement le conteneur
    padding : 20,         // Ajoute un peu de padding pour l'esthétique
  },
  searchBarWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: -25, // chevauche le bas de la carte
    zIndex: 2,
    // optionnel : ombre pour effet "flottant"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: "#FF9900",
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
    backgroundColor: "#34573E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flex: 1
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  title: { 
    textAlign: "left", // pour éviter le centrage
    fontSize: 20, 
    fontFamily: "Castoro"
  },
  subtitle: { 
    textAlign: "center", 
    fontSize: 20, 
    marginBottom: 10, 
    marginTop: 40,
  },
  map: { width: "90%", height: 200 },
});
