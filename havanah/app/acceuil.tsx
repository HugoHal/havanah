import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";
import CreateTripButton from "../components/CreateTripButton";
import StartTrip from "../components/StartTrip";
import Logo from "../assets/images/logo.svg";
import { useSpotSearch } from "../hooks/useSpots";

export default function AccueilScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { results, loading: searchLoading, search } = useSpotSearch();

  const handleCreateTrip = () => {
    console.log("Créer un itinéraire");
  };

  const handleStartTrip = () => {
    console.log("Démarrer un trip");
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    search(text);
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}> HAVANAH </Text>
          <StartTrip onPress={handleStartTrip}/>
        </View>
      </ImageBackground>
      
      <View style={styles.mapContainer}>
        <Text style={styles.mapLabel}>SPOT</Text>
        <CarteSpots />
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Rechercher un spot..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          
          {/* Résultats de recherche */}
          {searchQuery.length > 0 && (
            <FlatList
              data={results}
              style={styles.searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.searchResultItem}>
                  <Text style={styles.searchResultTitle}>{item.nom}</Text>
                  <Text style={styles.searchResultDescription}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
      
      {/* Container pour la section itinéraires populaires */}
      <View style={styles.popularTripsContainer}>
        <Text style={styles.subtitle}>Itinéraires populaires</Text>
        <Text style={styles.littlewords}>Inspire toi des aventures les plus aimée de la communauté van life</Text>

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
      </View>
      
      <CreateTripButton onPress={handleCreateTrip} />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#82A189",
  },
  backgroundImage: {
    height: 200,
    justifyContent: 'flex-start',
  },
  mapContainer: {
    width: "95%",
    height: 250,
    position: "relative",
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: -50,
    zIndex: 1,
    // Ombre pour la carte
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  searchBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -12,
    zIndex: 2,
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
    fontWeight: "bold",
    // Ombre pour l'input
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  btnSmall: {
    backgroundColor: "#34573E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    // Ombre pour les petits boutons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnMedium: {
    backgroundColor: "#FF9900",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 10,
    // Ombre pour les boutons moyens
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnPopu: {
    backgroundColor: "#34573E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flex: 1,
    // Ombre pour les boutons populaires
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    textAlign: "left",
    fontSize: 20, 
    fontFamily: "Castoro",
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: { 
    textAlign: "center", 
    fontSize: 20, 
    marginBottom: 0, 
    marginTop: 0,
    // Ombre pour le sous-titre
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3
  },
  littlewords: {
    textAlign: "center",
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
    marginHorizontal: 20,
    // Ombre pour les petites phrases
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2
  },
  mapLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 3,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
    // Ombre pour le label de la carte
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  searchResults: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchResultTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  searchResultDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  popularTripsContainer: {
    backgroundColor: "#E7D4BB",
    marginTop: 20,
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    // Ombre pour le container
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
