import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Image
} from 'react-native';
import { User } from '../types/User';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProfilCardProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function ProfilCard({ user, visible, onClose }: ProfilCardProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'ouverture - séparée en deux animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight * 0.25, // 75% de la hauteur depuis le bas
          duration: 300,
          useNativeDriver: false, // FALSE pour les propriétés layout
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true, // TRUE pour opacity seulement
        })
      ]).start();
    } else {
      // Animation de fermeture
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: false, // FALSE pour les propriétés layout
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true, // TRUE pour opacity seulement
        })
      ]).start();
    }
  }, [visible]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleSendMessage = () => {
    console.log("Envoyer un message à", user.pseudo);
  };

  const handleFollow = () => {
    console.log("Suivre", user.pseudo);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Fond sombre avec opacité */}
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        {/* Zone de fermeture en haut */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.topCloseArea} />
        </TouchableWithoutFeedback>
        
        {/* Container du modal */}
        <Animated.View 
          style={[
            styles.container,
            {
              top: slideAnim,
              height: screenHeight * 0.75,
            }
          ]}
        >
          {/* En-tête avec photo et infos principales */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <View style={styles.photoContainer}>
                {user.photoProfil ? (
                  <Image source={{ uri: user.photoProfil }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.defaultPhoto}>
                    <Ionicons name="person" size={40} color="#82A189" />
                  </View>
                )}
              </View>
              
              <Text style={styles.pseudo}>{user.pseudo}</Text>
              <Text style={styles.memberSince}>
                Membre depuis {formatDate(user.dateCreation)}
              </Text>
            </View>
            
            {/* Boutons d'action */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleSendMessage} style={styles.actionButton}>
                <Ionicons name="chatbubble" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleFollow} style={[styles.actionButton, styles.followButton]}>
                <Ionicons name="person-add" size={20} color="#34573E" />
                <Text style={[styles.actionButtonText, styles.followButtonText]}>Suivre</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Contenu scrollable */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Bio */}
            {user.bio && (
              <View style={styles.bioSection}>
                <Text style={styles.sectionTitle}>À propos</Text>
                <Text style={styles.bioText}>{user.bio}</Text>
              </View>
            )}
            
            {/* Statistiques */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="create" size={24} color="#34573E" />
                  <Text style={styles.statNumber}>{user.statistiques.nbItinerairesCreees}</Text>
                  <Text style={styles.statLabel}>Itinéraires créés</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#FF9900" />
                  <Text style={styles.statNumber}>{user.statistiques.nbItinerairesFaits}</Text>
                  <Text style={styles.statLabel}>Itinéraires faits</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="location" size={24} color="#82A189" />
                  <Text style={styles.statNumber}>{user.statistiques.nbSpotsFaits}</Text>
                  <Text style={styles.statLabel}>Spots visités</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="car" size={24} color="#E7D4BB" />
                  <Text style={styles.statNumber}>{user.statistiques.kmParcourus.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Km parcourus</Text>
                </View>
              </View>
            </View>
            
            {/* Badges/Récompenses */}
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>Badges</Text>
              <View style={styles.badgesContainer}>
                {user.statistiques.nbItinerairesFaits >= 10 && (
                  <View style={styles.badge}>
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                    <Text style={styles.badgeText}>Explorateur</Text>
                  </View>
                )}
                
                {user.statistiques.nbSpotsFaits >= 50 && (
                  <View style={styles.badge}>
                    <Ionicons name="star" size={20} color="#FF9900" />
                    <Text style={styles.badgeText}>Découvreur</Text>
                  </View>
                )}
                
                {user.statistiques.kmParcourus >= 10000 && (
                  <View style={styles.badge}>
                    <Ionicons name="car-sport" size={20} color="#34573E" />
                    <Text style={styles.badgeText}>Grand Voyageur</Text>
                  </View>
                )}
                
                {user.statistiques.nbItinerairesCreees >= 5 && (
                  <View style={styles.badge}>
                    <Ionicons name="map" size={20} color="#82A189" />
                    <Text style={styles.badgeText}>Créateur</Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Espace en bas */}
            <View style={styles.bottomSpace} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
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
    height: screenHeight * 0.25,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: "#bec4c7", // Remplacé ici
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  header: {
    backgroundColor: "#34573E",
    padding: 20,
    paddingTop: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  photoContainer: {
    marginBottom: 12,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  defaultPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E7D4BB',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pseudo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  followButton: {
    backgroundColor: '#fff',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  followButtonText: {
    color: '#34573E',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  bioSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34573E',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
  },
  statsSection: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34573E',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  badgesSection: {
    marginBottom: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomSpace: {
    height: 20,
  },
});