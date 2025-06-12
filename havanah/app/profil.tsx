import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { Stack } from "expo-router";
import { User, ItineraireUser, SpotVisite } from '../types/User';
import { userService } from '../services/userService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItineraireListCard from '../components/ItineraireListCard';
import SpotVisiteCard from '../components/SpotVisiteCard';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';

type TabType = 'stats' | 'itineraires' | 'faits' | 'spots';

export default function ProfilScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [userItineraires, setUserItineraires] = useState<ItineraireUser[]>([]);
  const [itinerairesFaits, setItinerairesFaits] = useState<ItineraireUser[]>([]);
  const [spotsVisites, setSpotsVisites] = useState<SpotVisite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const { logout } = useAuth();

  const loadData = async () => {
    try {
      const [userData, itinerairesData, faitsData, spotsData] = await Promise.all([
        userService.getCurrentUser(),
        userService.getUserItineraires(),
        userService.getItinerairesFaits(),
        userService.getSpotsVisites(),
      ]);
      
      setUser(userData);
      setUserItineraires(itinerairesData);
      setItinerairesFaits(faitsData);
      setSpotsVisites(spotsData);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      Alert.alert('Erreur', 'Impossible de charger les données du profil');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePhotoPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      try {
        const photoBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await userService.uploadProfilePhoto(photoBase64);
        setUser(prev => prev ? { ...prev, photoProfil: photoBase64 } : null);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !user) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>PROFIL</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#34573E" />
            <Text style={styles.loadingText}>Chargement du profil...</Text>
          </View>
        </View>
      </>
    );
  }

  const renderStats = (onStatPress: (tab: TabType) => void) => (
    <View style={styles.content}>
      <View style={styles.statsGrid}>
        <TouchableOpacity style={styles.statCard} onPress={() => onStatPress('itineraires')}>
          <Ionicons name="create" size={24} color="#34573E" />
          <Text style={styles.statNumber}>{user.statistiques.nbItinerairesCreees}</Text>
          <Text style={styles.statLabel}>Itinéraires créés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onStatPress('faits')}>
          <Ionicons name="checkmark-circle" size={24} color="#FF9900" />
          <Text style={styles.statNumber}>{user.statistiques.nbItinerairesFaits}</Text>
          <Text style={styles.statLabel}>Itinéraires faits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onStatPress('spots')}>
          <Ionicons name="location" size={24} color="#82A189" />
          <Text style={styles.statNumber}>{user.statistiques.nbSpotsFaits}</Text>
          <Text style={styles.statLabel}>Spots visités</Text>
        </TouchableOpacity>
        <View style={styles.statCard}>
          <Ionicons name="car" size={24} color="#E7D4BB" />
          <Text style={styles.statNumber}>{user.statistiques.kmParcourus.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Km parcourus</Text>
        </View>
      </View>
      
      {user.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>À propos</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItineraires = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Mes itinéraires ({userItineraires.length})</Text>
      {userItineraires.map((itineraire) => (
        <ItineraireListCard key={itineraire.id} itineraire={itineraire} />
      ))}
    </View>
  );

  const renderItinerairesFaits = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Itinéraires réalisés ({itinerairesFaits.length})</Text>
      {itinerairesFaits.map((itineraire) => (
        <ItineraireListCard key={itineraire.id} itineraire={itineraire} showCompleted />
      ))}
    </View>
  );

  const renderSpotsVisites = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Spots visités ({spotsVisites.length})</Text>
      {spotsVisites.map((spot, index) => (
        <SpotVisiteCard key={`${spot.spotId}-${index}`} spotVisite={spot} />
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats': return renderStats(setActiveTab);
      case 'itineraires': return renderItineraires();
      case 'faits': return renderItinerairesFaits();
      case 'spots': return renderSpotsVisites();
      default: return renderStats(setActiveTab);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>PROFIL</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#34573E']}
              tintColor="#34573E"
            />
          }
        >
          {/* Section profil */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={handlePhotoPress} style={styles.photoContainer}>
              {user.photoProfil ? (
                <Image source={{ uri: user.photoProfil }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.defaultPhoto}>
                  <Ionicons name="person" size={40} color="#82A189" />
                </View>
              )}
              <View style={styles.photoOverlay}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.pseudo}>{user.pseudo}</Text>
            <Text style={styles.memberSince}>
              Membre depuis {formatDate(user.dateCreation)}
            </Text>
          </View>

          {/* Onglets */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
              onPress={() => setActiveTab('stats')}
            >
              <Ionicons name="stats-chart" size={20} color={activeTab === 'stats' ? '#fff' : '#34573E'} />
              <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'itineraires' && styles.activeTab]}
              onPress={() => setActiveTab('itineraires')}
            >
              <Ionicons name="create" size={20} color={activeTab === 'itineraires' ? '#fff' : '#34573E'} />
              <Text style={[styles.tabText, activeTab === 'itineraires' && styles.activeTabText]}>Créés</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'faits' && styles.activeTab]}
              onPress={() => setActiveTab('faits')}
            >
              <Ionicons name="checkmark-circle" size={20} color={activeTab === 'faits' ? '#fff' : '#34573E'} />
              <Text style={[styles.tabText, activeTab === 'faits' && styles.activeTabText]}>Faits</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'spots' && styles.activeTab]}
              onPress={() => setActiveTab('spots')}
            >
              <Ionicons name="location" size={20} color={activeTab === 'spots' ? '#fff' : '#34573E'} />
              <Text style={[styles.tabText, activeTab === 'spots' && styles.activeTabText]}>Spots</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu de l'onglet actif */}
          {renderTabContent()}
        </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  defaultPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E7D4BB',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#34573E',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pseudo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#bec4c7',
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 5,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 5,
  },
  activeTab: {
    backgroundColor: '#34573E',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34573E',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34573E',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bioSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34573E',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
