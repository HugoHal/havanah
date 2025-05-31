import { View, Text, StyleSheet } from 'react-native';
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";

export default function SpotsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* En-tête avec direction artistique verte */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>SPOTS</Text>
        </View>
        
        {/* Container de la carte */}
        <View style={styles.mapContainer}>
          <CarteSpots />
        </View>
        
        {/* Espace en bas pour montrer la fermeture */}
        <View style={styles.bottomSpace} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#82A189",
  },
  header: {
    backgroundColor: "#34573E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  pageTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mapContainer: {
    height: '83.5%', // Hauteur fixe au lieu de flex: 1
    marginHorizontal: 5,
    marginTop: 5,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSpace: {
    flex: 1, // Prend l'espace restant
    backgroundColor: "#82A189",
    minHeight: 20, // Hauteur minimum garantie
  },
});