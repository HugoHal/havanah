import { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from "expo-router";
import CreateTripButton from "../components/CreateTripButton";
import PopularTrips, { PopularTripsRef } from "../components/PopularTrips";
import { getItinerairePopulaire } from "../services/itineraireService";
import ItineraireFiche from "../components/ItineraireFiche";
import { Itineraire } from "../types/Itineraire";

export default function ItinerairesScreen() {
  const [selectedItineraire, setSelectedItineraire] = useState<Itineraire | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Refs pour pouvoir réinitialiser les sélections
  const popularTripsRef = useRef<PopularTripsRef>(null);
  const favoritesTripsRef = useRef<PopularTripsRef>(null);

  const handleCreateTrip = () => {
    console.log("Créer un itinéraire");
  };

  const handlePopularSelect = (period: 'court' | 'moyen' | 'long') => {
    console.log(`Itinéraires populaires: ${period}`);
    const itineraire = getItinerairePopulaire(period);
    setSelectedItineraire(itineraire);
    setModalVisible(true);
  };

  const handleFavoritesSelect = (period: 'court' | 'moyen' | 'long') => {
    console.log(`Mes favoris: ${period}`);
    // Tu peux créer une autre fonction pour les favoris
  };

  const closeModal = () => {
    setModalVisible(false);
    // Réinitialiser les sélections des boutons
    popularTripsRef.current?.resetSelection();
    favoritesTripsRef.current?.resetSelection();
    
    // Attendre la fin de l'animation avant de supprimer l'itinéraire
    setTimeout(() => {
      setSelectedItineraire(null);
    }, 250);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* En-tête avec direction artistique verte */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>ITINÉRAIRES</Text>
        </View>
        
        <PopularTrips 
          ref={popularTripsRef}
          onPeriodSelect={handlePopularSelect}
          containerStyle={{ marginTop: 10 }}
        />
        
        <PopularTrips 
          ref={favoritesTripsRef}
          title="Mes favoris"
          subtitle="Tes itinéraires sauvegardés et préférés"
          onPeriodSelect={handleFavoritesSelect}
        />
        
        <CreateTripButton onPress={handleCreateTrip} />
      </View>

      {/* Modal qui s'affiche par-dessus */}
      {selectedItineraire && (
        <ItineraireFiche 
          itineraire={selectedItineraire}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
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
});
