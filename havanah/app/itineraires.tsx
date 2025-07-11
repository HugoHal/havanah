import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from "expo-router";
import CreateTripButton from "../components/CreateTripButton";
import PopularTrips, { PopularTripsRef } from "../components/PopularTrips";
import { getItinerairePopulaire, getAllItineraires } from "../services/itineraireService"; // ✅ Import ajouté
import ItineraireFiche from "../components/ItineraireFiche";
import { Itineraire } from "../types/Itineraire";
import { userService } from "../services/userService";
import { ItineraireUser } from "../types/User";
import CreateTripModal from "../components/CreateTripModal";
import ItinerairesMap from "../components/ItinerairesMap"; // ✅ Import ajouté
import CO2Badge from "../components/CO2Badge"; // ✅ Import ajouté

export default function ItinerairesScreen() {
  const [selectedItineraire, setSelectedItineraire] = useState<Itineraire | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createTripVisible, setCreateTripVisible] = useState(false);
  const [userItineraires, setUserItineraires] = useState<ItineraireUser[]>([]);
  const [favoriteItineraires, setFavoriteItineraires] = useState<ItineraireUser[]>([]);
  const [allItineraires, setAllItineraires] = useState<Itineraire[]>([]); // ✅ État ajouté
  
  // Refs pour pouvoir réinitialiser les sélections
  const popularTripsRef = useRef<PopularTripsRef>(null);
  const favoritesTripsRef = useRef<PopularTripsRef>(null);

  useEffect(() => {
    userService.getUserItineraires().then(setUserItineraires);
  }, []);

  useEffect(() => {
    userService.getFavoriteItineraires().then(setFavoriteItineraires);
  }, []);

  // ✅ Charger tous les itinéraires pour la carte
  useEffect(() => {
    const itineraires = getAllItineraires();
    setAllItineraires(itineraires);
  }, []);

  const handleCreateTrip = () => {
    setCreateTripVisible(true);
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

  // ✅ Fonction pour sélectionner un itinéraire depuis la carte
  const handleMapItineraireSelect = (itineraire: Itineraire) => {
    setSelectedItineraire(itineraire);
    setModalVisible(true);
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* En-tête avec direction artistique verte */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>ITINÉRAIRES</Text>
          </View>
          
          <PopularTrips 
            ref={popularTripsRef}
            onPeriodSelect={handlePopularSelect}
            containerStyle={{ marginTop: 10 }}
          />

          <CreateTripButton onPress={handleCreateTrip} />
          
          {/* Mes itinéraires section */}
          {userItineraires.length > 0 && (
            <View style={styles.myItinerairesSection}>
              <Text style={styles.myItinerairesTitle}>Mes itinéraires</Text>
              <FlatList
                data={userItineraires}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.myItinerairesList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.myItineraireCard}
                    onPress={() => {
                      setSelectedItineraire(item);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.myItineraireName}>{item.nom}</Text>
                    <Text style={styles.myItineraireDesc} numberOfLines={2}>{item.description}</Text>
                    <Text style={styles.myItineraireInfo}>{item.duree} jours • {item.distance} km</Text>
                    {/* ✅ Ajout du CO2 économisé */}
                    <CO2Badge co2Economise={item.co2Economise} size="small" style={styles.co2Badge} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          
          {/* Mes favoris section */}
          {favoriteItineraires.length > 0 && (
            <View style={styles.myItinerairesSection}>
              <Text style={styles.myItinerairesTitle}>Mes favoris</Text>
              <FlatList
                data={favoriteItineraires}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.myItinerairesList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.myItineraireCard}
                    onPress={() => {
                      setSelectedItineraire(item);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.myItineraireName}>{item.nom}</Text>
                    <Text style={styles.myItineraireDesc} numberOfLines={2}>{item.description}</Text>
                    <Text style={styles.myItineraireInfo}>{item.duree} jours • {item.distance} km</Text>
                    {/* ✅ Ajout du CO2 économisé */}
                    <CO2Badge co2Economise={item.co2Economise} size="small" style={styles.co2Badge} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* ✅ Carte interactive des itinéraires */}
          <ItinerairesMap 
            itineraires={allItineraires}
            onItineraireSelect={handleMapItineraireSelect}
          />
        </ScrollView>

        {/* Modal d'itinéraire qui s'affiche par-dessus */}
        {selectedItineraire && (
          <ItineraireFiche 
            itineraire={selectedItineraire}
            visible={modalVisible}
            onClose={closeModal}
          />
        )}

        {/* Modal de création d'itinéraire */}
        <CreateTripModal 
          visible={createTripVisible} 
          onClose={() => setCreateTripVisible(false)} 
        />
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
  myItinerairesSection: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
  },
  myItinerairesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34573E",
    marginBottom: 8,
    marginLeft: 2,
  },
  myItinerairesList: {
    paddingBottom: 8,
  },
  myItineraireCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  myItineraireName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#34573E",
    marginBottom: 4,
  },
  myItineraireDesc: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  myItineraireInfo: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  co2Badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});
