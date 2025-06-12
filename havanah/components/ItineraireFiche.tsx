// components/ItineraireFiche.tsx
import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Animated, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { Itineraire, DetailedRoute } from '../types/Itineraire';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItineraireMap from './ItineraireMap';
import NavigationView from './NavigationView';
import CO2Badge from './CO2Badge'; // ✅ Import ajouté

interface ItineraireFicheProps {
  itineraire: Itineraire;
  visible: boolean;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export default function ItineraireFiche({ itineraire, visible, onClose }: ItineraireFicheProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    if (visible) {
      // Animation d'ouverture - remonte depuis le bas
      Animated.timing(slideAnim, {
        toValue: screenHeight * 0.2, // 80% de la hauteur (20% depuis le haut)
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Animation de fermeture - redescend vers le bas
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const handleComment = () => {
    console.log("Ouvrir l'interface de commentaire");
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  // Fonction pour charger/utiliser la route détaillée
  const loadDetailedRoute = async () => {
    if (!itineraire.waypoints || loadingRoute) return;
    
    setLoadingRoute(true);
    try {
      // Vérifier si on a déjà une route détaillée dans les données
      if (itineraire.detailedRoute && 
          itineraire.detailedRoute.path && 
          itineraire.detailedRoute.path.length > 0) {
        console.log('Utilisation de la route détaillée existante');
        setShowNavigation(true);
      } else {
        console.log('Pas de route détaillée disponible pour cet itinéraire');
        // Optionnel : afficher un message à l'utilisateur
        // Alert.alert('Information', 'Navigation détaillée non disponible pour cet itinéraire');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la route:', error);
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Fond sombre avec opacité - seulement sur les côtés */}
      <View style={styles.overlay}>
        {/* Zone de fermeture en haut */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.topCloseArea} />
        </TouchableWithoutFeedback>
        
        {/* Container du modal - sans TouchableWithoutFeedback */}
        <Animated.View 
          style={[
            styles.container,
            {
              top: slideAnim,
              height: screenHeight * 0.8, // 80% de la hauteur
            }
          ]}
        >
          {/* En-tête avec titre et bouton fermer - FIXE */}
          <View style={styles.header}>
            <Text style={styles.title}>{itineraire.nom}</Text>
            <View style={styles.headerButtons}>
              {/* Bouton Commentaire */}
              <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>Commenter</Text>
              </TouchableOpacity>
              
              {/* Bouton Favoris */}
              <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
                <Ionicons 
                  name={isFavorite ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={isFavorite ? "#FFD700" : "#fff"} 
                />
              </TouchableOpacity>
              
              {/* Bouton Fermer */}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Contenu scrollable */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>{itineraire.description}</Text>
            
            {/* Nouvelle section carte de trajet */}
            {itineraire.waypoints && itineraire.waypoints.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Trajet détaillé :</Text>
                
                {!showNavigation ? (
                  <>
                    <ItineraireMap itineraire={itineraire} showRoute={true} />
                    
                    {/* Bouton navigation seulement si on a une route détaillée */}
                    {itineraire.detailedRoute && (
                      <TouchableOpacity 
                        style={styles.navigationButton}
                        onPress={loadDetailedRoute}
                        disabled={loadingRoute}
                      >
                        <Ionicons name="navigate" size={20} color="#fff" />
                        <Text style={styles.navigationButtonText}>
                          {loadingRoute ? 'Chargement...' : 'Navigation détaillée'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <>
                    {itineraire.detailedRoute && (
                      <NavigationView route={itineraire.detailedRoute} />
                    )}
                    
                    <TouchableOpacity 
                      style={styles.backButton}
                      onPress={() => setShowNavigation(false)}
                    >
                      <Ionicons name="arrow-back" size={20} color="#fff" />
                      <Text style={styles.navigationButtonText}>Retour à la vue générale</Text>
                    </TouchableOpacity>
                  </>
                )}
                
                {/* Liste des étapes */}
                <Text style={styles.sectionTitle}>Étapes du voyage :</Text>
                {itineraire.waypoints
                  .sort((a, b) => a.order - b.order)
                  .map((waypoint, index) => (
                    <View key={waypoint.id} style={styles.waypointItem}>
                      <View style={styles.waypointNumber}>
                        <Text style={styles.waypointNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.waypointInfo}>
                        <Text style={styles.waypointName}>{waypoint.name}</Text>
                        {waypoint.description && (
                          <Text style={styles.waypointDescription}>{waypoint.description}</Text>
                        )}
                        {waypoint.estimatedArrivalTime && (
                          <Text style={styles.waypointTime}>Arrivée : {waypoint.estimatedArrivalTime}</Text>
                        )}
                      </View>
                    </View>
                  ))}
              </>
            )}
            
            <View style={styles.infosRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={18} color="#34573E" />
                <Text style={styles.infoText}>{itineraire.duree}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="car" size={18} color="#34573E" />
                <Text style={styles.infoText}>{itineraire.distance}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="star" size={18} color="#FF9900" />
                <Text style={styles.infoText}>{itineraire.note}/5</Text>
              </View>
              {/* ✅ Ajout du CO2 économisé */}
              <CO2Badge co2Economise={itineraire.co2Economise} size="small" />
            </View>
            
            <Text style={styles.spotsTitle}>Spots inclus :</Text>
            {itineraire.spots.map((spot, index) => (
              <View key={index} style={styles.spotContainer}>
                <Text style={styles.spotItem}>• {spot}</Text>
                <Text style={styles.spotDescription}>
                  Description détaillée de ce spot magnifique avec toutes les informations utiles...
                </Text>
              </View>
            ))}
            
            {/* Section supplémentaire pour tester le scroll */}
            <Text style={styles.sectionTitle}>Détails du voyage :</Text>
            <Text style={styles.detailText}>
              • Meilleure période : Printemps et automne{'\n'}
              • Niveau de difficulté : Facile{'\n'}
              • Type de véhicule : Tous types de vans{'\n'}
              • Budget estimé : 50-80€/jour{'\n'}
              • Points d'intérêt : Nature, culture, gastronomie
            </Text>
            
            <Text style={styles.sectionTitle}>Équipements recommandés :</Text>
            <Text style={styles.detailText}>
              • Réserve d'eau 100L minimum{'\n'}
              • Panneau solaire conseillé{'\n'}
              • Chaises et table de camping{'\n'}
              • Vélos pour les balades{'\n'}
              • Matériel de pêche (optionnel)
            </Text>
            
            <View style={styles.footer}>
              <Text style={styles.views}>{itineraire.nbVues} vues</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Voir l'itinéraire complet</Text>
              </TouchableOpacity>
            </View>
            
            {/* Espace en bas pour le scroll */}
            <View style={styles.bottomSpace} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topCloseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.2, // Zone cliquable en haut
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: "#bec4c7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    backgroundColor: "#34573E",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 70,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 50,
  },
  actionText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    lineHeight: 24,
  },
  infosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#34573E",
  },
  spotsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#34573E",
  },
  spotContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
  },
  spotItem: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 5,
  },
  spotDescription: {
    fontSize: 13,
    color: "#666",
    marginLeft: 15,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#34573E",
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  views: {
    fontSize: 14,
    color: "#666",
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: "#FF9900",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
  bottomSpace: {
    height: 30,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 10,
  },
  waypointNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF9900',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waypointNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34573E',
    marginBottom: 4,
  },
  waypointDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  waypointTime: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9900',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34573E',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    gap: 10,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});