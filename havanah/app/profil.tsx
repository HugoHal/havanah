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
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Stack } from "expo-router";
import { User, ItineraireUser, SpotVisite } from '../types/User';
import { userService } from '../services/userService';
import { getUserItinerairesWithSpots, getItinerairesFaitsWithSpotsAndDate } from '../services/itineraireService';
import { getSpotsFromItinerairesFaits } from '../services/itineraireService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItineraireListCard from '../components/ItineraireListCard';
import SpotVisiteCard from '../components/SpotVisiteCard';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import ItineraireFiche from '../components/ItineraireFiche'; // Assure-toi que l'import existe

type TabType = 'stats' | 'itineraires' | 'faits' | 'spots';

export default function ProfilScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [userItineraires, setUserItineraires] = useState<ItineraireUser[]>([]);
  const [itinerairesFaits, setItinerairesFaits] = useState<ItineraireUser[]>([]);
  const [spotsVisites, setSpotsVisites] = useState<SpotVisite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [stats, setStats] = useState({
    nbItinerairesCreees: 0,
    nbItinerairesFaits: 0,
    nbSpotsFaits: 0,
    kmParcourus: 0,
  });
  const [editBioVisible, setEditBioVisible] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const { logout } = useAuth();
  const [selectedItineraire, setSelectedItineraire] = useState(null);
  const [itineraireModalVisible, setItineraireModalVisible] = useState(false);

  const loadData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      let itinerairesData: ItineraireUser[] = [];
      let faitsData: ItineraireUser[] = [];
      let spotsData: SpotVisite[] = [];
      if (userData?.id) {
        itinerairesData = await getUserItinerairesWithSpots(userData.id);
        faitsData = await getItinerairesFaitsWithSpotsAndDate(userData.id);
        spotsData = await getSpotsFromItinerairesFaits(userData.id); // <-- nouvelle fonction
      }
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

  const handleEditBio = () => {
    setBioInput(user?.bio ?? '');
    setEditBioVisible(true);
  };

  const handleSaveBio = async () => {
    console.log('Tentative de sauvegarde de la bio:', bioInput, 'pour user:', user?.id);
    try {
      const { error } = await supabase
        .from('users')
        .update({ bio: bioInput })
        .eq('id', user?.id);

      if (error) {
        console.log('Erreur Supabase:', error);
        Alert.alert('Erreur', "Impossible de modifier la bio");
      } else {
        console.log('Bio modifiée avec succès');
        setUser(prev => prev ? { ...prev, bio: bioInput } : prev);
        setEditBioVisible(false);
      }
    } catch (e) {
      console.log('Exception JS:', e);
      Alert.alert('Erreur', "Impossible de modifier la bio");
    }
  };

  const handleItinerairePress = (itineraire) => {
    setSelectedItineraire(itineraire);
    setItineraireModalVisible(true);
  };

  const closeItineraireModal = () => {
    setItineraireModalVisible(false);
    setTimeout(() => setSelectedItineraire(null), 250);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      if (user?.id) {
        // Itinéraires créés
        const { count: nbItinerairesCreees } = await supabase
          .from('itineraires')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id);

        // Itinéraires faits
        const { count: nbItinerairesFaits } = await supabase
          .from('itineraire_visites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Spots visités
        const { count: nbSpotsFaits } = await supabase
          .from('spot_visites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Km parcourus (sum des distances des itinéraires faits)
        const { data: kmData, error: kmError } = await supabase
          .rpc('sum_distance_for_user', { user_id_input: user.id });

        const { data: totalSpotsData } = await supabase
          .rpc('total_spots_visited', { user_id_input: user.id });

        const totalSpots = totalSpotsData?.[0]?.total ?? 0;

        setStats({
          nbItinerairesCreees: nbItinerairesCreees ?? 0,
          nbItinerairesFaits: nbItinerairesFaits ?? 0,
          nbSpotsFaits: totalSpots,
          kmParcourus: kmData?.[0]?.sum ?? 0,
        });
      }
    }
    fetchStats();
  }, [user?.id]);

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
          <Text style={styles.statNumber}>{stats.nbItinerairesCreees}</Text>
          <Text style={styles.statLabel}>Itinéraires créés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onStatPress('faits')}>
          <Ionicons name="checkmark-circle" size={24} color="#FF9900" />
          <Text style={styles.statNumber}>{stats.nbItinerairesFaits}</Text>
          <Text style={styles.statLabel}>Itinéraires faits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => onStatPress('spots')}>
          <Ionicons name="location" size={24} color="#82A189" />
          <Text style={styles.statNumber}>{stats.nbSpotsFaits}</Text>
          <Text style={styles.statLabel}>Spots visités</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard}>
          <Ionicons name="walk" size={24} color="#007AFF" />
          <Text style={styles.statNumber}>{stats.kmParcourus.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Km parcourus</Text>
        </TouchableOpacity>
      </View>
      
      {/*
        Affiche toujours la section bio, même si la bio est vide
      */}
      <View style={styles.bioSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.bioTitle}>À propos</Text>
          <TouchableOpacity onPress={handleEditBio}>
            <Ionicons name="create-outline" size={18} color="#34573E" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{user.bio ?? ''}</Text>
      </View>

      {/* Modal édition bio */}
      <Modal
        visible={editBioVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditBioVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 15,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Modifier la bio</Text>
            <TextInput
              value={bioInput}
              onChangeText={setBioInput}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                width: '100%',
                marginBottom: 15,
                minHeight: 60,
                textAlignVertical: 'top'
              }}
              multiline
              maxLength={300}
              placeholder="Décris-toi..."
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#34573E',
                  padding: 10,
                  borderRadius: 8,
                  minWidth: 80,
                  alignItems: 'center'
                }}
                onPress={handleSaveBio}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ccc',
                  padding: 10,
                  borderRadius: 8,
                  minWidth: 80,
                  alignItems: 'center'
                }}
                onPress={() => setEditBioVisible(false)}
              >
                <Text style={{ color: '#34573E', fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
        <ItineraireListCard
          key={itineraire.id}
          itineraire={itineraire}
          onPress={() => handleItinerairePress(itineraire)}
        />
      ))}
    </View>
  );

  const renderItinerairesFaits = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Itinéraires réalisés ({itinerairesFaits.length})</Text>
      {itinerairesFaits.map((itineraire) => (
        <ItineraireListCard
          key={itineraire.id}
          itineraire={itineraire}
          showCompleted
          onPress={() => handleItinerairePress(itineraire)}
        />
      ))}
    </View>
  );

  const renderSpotsVisites = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Spots visités ({spotsVisites.length})</Text>
      {spotsVisites.map((spot, index) => (
        <SpotVisiteCard key={`${spot.id}-${index}`} spotVisite={spot} />
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
            <View style={styles.photoContainer}>
              <TouchableOpacity onPress={handlePhotoPress}>
                {user?.photoProfil ? (
                  <Image source={{ uri: user.photoProfil }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.defaultPhoto}>
                    <Ionicons name="person" size={40} color="#82A189" />
                  </View>
                )}
                <View style={styles.photoOverlay}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.pseudo}>{user.pseudo}</Text>
            <Text style={styles.memberSince}>
              Membre depuis {user.date_creation
                ? formatDate(new Date(user.date_creation))
                : 'Date inconnue'}
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

      {selectedItineraire && (
        <ItineraireFiche
          itineraire={selectedItineraire}
          visible={itineraireModalVisible}
          onClose={closeItineraireModal}
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

supabase.auth.getSession().then(({ data }) => {
  console.log('ID utilisateur connecté (auth.uid):', data?.session?.user?.id);
});
