import { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Animated } from "react-native";
import { Stack } from "expo-router";
import CarteSpots from "../components/CarteSpots";
import CreateTripButton from "../components/CreateTripButton";
import StartTrip, { StartTripRef } from "../components/StartTrip";
import Logo from "../assets/images/logo.svg";
import { useSpotSearch } from "../hooks/useSpots";
import PopularTrips, { PopularTripsRef } from "../components/PopularTrips";
import { getItinerairePopulaire } from "../services/itineraireService";
import ItineraireFiche from "../components/ItineraireFiche";
import { Itineraire } from "../types/Itineraire";
import TripModal from "../components/TripModal";
import CreateTripModal from "../components/CreateTripModal";

export default function AccueilScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItineraire, setSelectedItineraire] = useState<Itineraire | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [createTripVisible, setCreateTripVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const popularTripsRef = useRef<PopularTripsRef>(null);
  const startTripRef = useRef<StartTripRef>(null);

  const handleCreateTrip = () => {
    setCreateTripVisible(true);
  };

  const handleStartTrip = () => {
    startTripRef.current?.playOpen();
  };

  const handleTripModalOpen = () => {
    setTripModalVisible(true);
  };

  const handleTripModalClose = () => {
    setTripModalVisible(false);
    setTimeout(() => {
      startTripRef.current?.playClose();
    }, 10);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    search(text);
  };

  const handlePeriodSelect = (period: 'court' | 'moyen' | 'long') => {
    console.log(`Durée sélectionnée dans accueil: ${period}`);
    const itineraire = getItinerairePopulaire(period);
    setSelectedItineraire(itineraire);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    popularTripsRef.current?.resetSelection();
    
    setTimeout(() => {
      setSelectedItineraire(null);
    }, 250);
  };

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => {
    setModalVisible(false);
    // Animation inverse
    setTimeout(() => {
      if (startTripRef.current?.playClose) {
        startTripRef.current.playClose();
      }
    }, 10);
  };

  const { results, loading: searchLoading, search } = useSpotSearch();

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
          <StartTrip
            onOpen={handleTripModalOpen}
            ref={startTripRef}
            animation={animation}
          />
        </View>
      </ImageBackground>
      
      {/* Container de la carte SANS overflow hidden */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapLabel}>SPOTS</Text>
        <CarteSpots />
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Rechercher un spot..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      {/* Résultats de recherche EN DEHORS du mapContainer */}
      {searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
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
        </View>
      )}
      
      <PopularTrips 
        ref={popularTripsRef}
        onPeriodSelect={handlePeriodSelect}
      />
      
      <CreateTripButton onPress={handleCreateTrip} />

      <CreateTripModal visible={createTripVisible} onClose={() => setCreateTripVisible(false)} />
    </View>

    {selectedItineraire && (
      <ItineraireFiche 
        itineraire={selectedItineraire}
        visible={modalVisible}
        onClose={closeModal}
      />
    )}
    <TripModal visible={tripModalVisible} onClose={handleTripModalClose} />
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
    borderTopLeftRadius: 20,      // <-- Ajouté
    borderTopRightRadius: 20,     // <-- Ajouté
    marginTop: -50,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: "#bec4c7",
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
  // NOUVEAU: Container pour les résultats en dehors
  searchResultsContainer: {
    width: "95%",
    alignSelf: "center",
    marginTop: -2, // Léger ajustement pour coller à la barre de recherche
    zIndex: 10,
  },
  input: {
    backgroundColor: "#FF9900",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  searchResults: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
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
  btnSmall: {
    backgroundColor: "#34573E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
