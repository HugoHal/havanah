import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from "expo-router";
import CreateTripButton from "../components/CreateTripButton";


export default function SpotsScreen() {
  const handleCreateTrip = () => {
    console.log("Créer un itinéraire");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.title}> ITINERAIRES </Text>
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
        <Text style={styles.subtitle}>Mes favoris</Text>
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
  },
  title: { textAlign: "center", fontSize: 20, marginBottom: 10, marginTop: 30, fontWeight: "bold" },
  subtitle: { textAlign: "center", fontSize: 20, marginBottom: 10, marginTop: 30, fontWeight: "bold" },
  btnPopu: {
    backgroundColor: "#D4C1A7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flex: 1
  },
})
