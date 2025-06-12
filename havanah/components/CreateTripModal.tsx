import React, { useState } from "react";
import { Modal, View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, ImageBackground, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const BG_HEIGHT = 200;

function getMarkedDates(start: string | null, end: string | null) {
    if (!start) return {};
    let marked: any = {};
    marked[start] = { startingDay: true, color: "#FF9900", textColor: "#fff" };
    if (end && end !== start) {
        let current = new Date(start);
        const last = new Date(end);
        while (current <= last) {
            const dateStr = current.toISOString().split('T')[0];
            marked[dateStr] = {
                color: "#FF9900",
                textColor: "#fff",
                ...(dateStr === start ? { startingDay: true } : {}),
                ...(dateStr === end ? { endingDay: true } : {}),
            };
            current.setDate(current.getDate() + 1);
        }
    }
    return marked;
}

const QUESTIONS = [
    {
        question: "Où veux-tu aller ?",
        options: ["Montagne", "Mer", "Campagne", "Ville"],
        multiple: true,
    },
    {
        question: "Combien de jours veux-tu partir ?",
        options: ["1-2", "3-5", "6-10", "Plus de 10"],
        multiple: false,
    },
    {
        question: "Quel est ton budget ?",
        options: ["< 100€", "100-300€", "300-600€", "> 600€"],
        multiple: false,
    }
];

// Données mockées pour les 3 itinéraires proposés
const MOCK_PROPOSED_ITINERAIRES = [
  {
    id: 1,
    title: "Côte Méditerranéenne",
    duration: "5 jours",
    distance: "320 km",
    highlights: ["Montpellier", "Palavas", "Sète", "Cap d'Agde"],
    path: [
      [43.6108, 3.8767], // Montpellier
      [43.5285, 3.9310], // Palavas
      [43.4023, 3.6967], // Sète
      [43.3089, 3.4814], // Cap d'Agde
    ],
    color: "#FF9900",
    description: "Découvrez les plus belles plages de l'Hérault",
    budget: "200-300€"
  },
  {
    id: 2,
    title: "Arrière-pays & Nature",
    duration: "7 jours", 
    distance: "450 km",
    highlights: ["Montpellier", "Saint-Guilhem", "Millau", "Cévennes"],
    path: [
      [43.6108, 3.8767], // Montpellier
      [43.7314, 3.5483], // Saint-Guilhem-le-Désert
      [44.0993, 3.0808], // Millau
      [44.1944, 3.8333], // Cévennes
    ],
    color: "#4CAF50",
    description: "Immersion nature entre gorges et montagnes",
    budget: "150-250€"
  },
  {
    id: 3,
    title: "Circuit Culturel",
    duration: "6 jours",
    distance: "380 km", 
    highlights: ["Montpellier", "Nîmes", "Arles", "Avignon"],
    path: [
      [43.6108, 3.8767], // Montpellier
      [43.8367, 4.3601], // Nîmes
      [43.6761, 4.6309], // Arles
      [43.9493, 4.8059], // Avignon
    ],
    color: "#2196F3",
    description: "Découverte du patrimoine historique régional",
    budget: "250-350€"
  }
];

export default function CreateTripModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [step, setStep] = useState(0);
    const [dateType, setDateType] = useState<"precise" | "approx" | null>(null);
    const [range, setRange] = useState<{ start: string | null, end: string | null }>({ start: null, end: null });
    const [approxDays, setApproxDays] = useState<number | null>(null);
    const [approxStep, setApproxStep] = useState<1 | 2>(1); // 1: période, 2: nb jours
    const [departure, setDeparture] = useState<{ latitude: number; longitude: number } | null>(null);
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState({
        latitude: 46.603354,
        longitude: 1.888334,
        latitudeDelta: 3,
        longitudeDelta: 3,
    });
    const [showPartner, setShowPartner] = useState<"rent" | "info" | null>(null);
    const [previousStep, setPreviousStep] = useState<number | null>(null);
    const [companions, setCompanions] = useState<string[]>([]);
    const [distance, setDistance] = useState<string | null>(null); // pour la question 5
    const [rythm, setRythm] = useState<string | null>(null);       // pour la question 6
    const [places, setPlaces] = useState<string[]>([]);
    const [ambiance, setAmbiance] = useState<string[]>([]);
    const [budget, setBudget] = useState<string | null>(null);
    const [spotType, setSpotType] = useState<string[]>([]);
    const [activities, setActivities] = useState<string[]>([]);
    const [eco, setEco] = useState<string | null>(null);
    const [constraints, setConstraints] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false); // ✅ Nouvel état pour l'étape résultats
    const [selectedItinerary, setSelectedItinerary] = useState<number | null>(null); // ✅ Itinéraire sélectionné

    const insets = useSafeAreaInsets();

    const handleSearch = async () => {
        if (!search) return;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`,
                {
                    headers: {
                        "User-Agent": "HavanahApp/1.0 (contact@havanah.app)"
                    }
                }
            );
            const results = await response.json();
            if (results && results.length > 0) {
                setRegion({
                    latitude: parseFloat(results[0].lat),
                    longitude: parseFloat(results[0].lon),
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                });
            } else {
                alert("Lieu non trouvé");
            }
        } catch (e) {
            alert("Erreur lors de la recherche");
        }
    };

    const logAnswers = () => {
        console.log("Réponses du questionnaire :");
        console.log("Type de date :", dateType);
        console.log("Période :", range);
        console.log("Nombre de jours (approx) :", approxDays);
        console.log("Départ :", departure);
        console.log("Compagnons :", companions);
        console.log("Distance :", distance);
        console.log("Rythme :", rythm);
        console.log("Types de lieux :", places);
        console.log("Ambiance :", ambiance);
        console.log("Budget :", budget);
        console.log("Type de spots :", spotType);
        console.log("Activités :", activities);
        console.log("Écoresponsable :", eco);
        console.log("Contraintes :", constraints);
        
        // ✅ Au lieu de fermer directement, passer aux résultats
        setShowResults(true);
    };

    const resetForm = () => {
        setStep(0);
        setDateType(null);
        setRange({ start: null, end: null });
        setApproxDays(null);
        setApproxStep(1);
        setDeparture(null);
        setSearch("");
        setRegion({
            latitude: 46.603354,
            longitude: 1.888334,
            latitudeDelta: 3,
            longitudeDelta: 3,
        });
        setShowPartner(null);
        setPreviousStep(null);
        setCompanions([]);
        setDistance(null);
        setRythm(null);
        setPlaces([]);
        setAmbiance([]);
        setBudget(null);
        setSpotType([]);
        setActivities([]);
        setEco(null);
        setConstraints([]);
        setShowResults(false); // ✅ Reset du nouvel état
        setSelectedItinerary(null); // ✅ Reset de la sélection
    };

    // ✅ Fonction pour gérer la sélection d'un itinéraire
    const handleItinerarySelect = (itineraryId: number) => {
      setSelectedItinerary(itineraryId);
      console.log(`Itinéraire sélectionné: ${itineraryId}`);
      
      // Fermer le modal après sélection
      setTimeout(() => {
        onClose();
        resetForm();
      }, 500);
    };

    // ✅ Calculer la région de la carte pour afficher tous les itinéraires
    const getMapRegion = () => {
      const allCoordinates = MOCK_PROPOSED_ITINERAIRES.flatMap(itinerary => itinerary.path);
      const latitudes = allCoordinates.map(coord => coord[0]);
      const longitudes = allCoordinates.map(coord => coord[1]);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      return {
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLng + minLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.3,
        longitudeDelta: (maxLng - minLng) * 1.3,
      };
    };

    // ✅ Étape des résultats avec carte et sélection
    if (showResults) {
      return (
        <Modal visible={visible} animationType="slide" transparent={false}>
          <View style={styles.container}>
            <ImageBackground
              source={require("../assets/images/pexels-lum3n-44775-167684.jpeg")}
              style={styles.backgroundImage}
            >
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </ImageBackground>

            <View style={styles.greenPart}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.questionText}>Voici vos itinéraires personnalisés !</Text>
                
                {/* Carte avec les 3 itinéraires */}
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.resultsMap}
                    initialRegion={getMapRegion()}
                    scrollEnabled={true}
                    zoomEnabled={true}
                  >
                    {/* Tracés des itinéraires */}
                    {MOCK_PROPOSED_ITINERAIRES.map((itinerary) => (
                      <Polyline
                        key={`route-${itinerary.id}`}
                        coordinates={itinerary.path.map(point => ({
                          latitude: point[0],
                          longitude: point[1]
                        }))}
                        strokeColor={itinerary.color}
                        strokeWidth={selectedItinerary === itinerary.id ? 6 : 4}
                      />
                    ))}
                    
                    {/* Markers de départ et arrivée */}
                    {MOCK_PROPOSED_ITINERAIRES.map((itinerary) => (
                      <React.Fragment key={`markers-${itinerary.id}`}>
                        {/* Départ */}
                        <Marker
                          coordinate={{
                            latitude: itinerary.path[0][0],
                            longitude: itinerary.path[0][1]
                          }}
                          title={`Départ ${itinerary.title}`}
                        >
                          <View style={[styles.startMarker, { borderColor: itinerary.color }]}
                          >
                            <Ionicons name="play" size={16} color={itinerary.color} />
                          </View>
                        </Marker>
                        
                        {/* Arrivée */}
                        <Marker
                          coordinate={{
                            latitude: itinerary.path[itinerary.path.length - 1][0],
                            longitude: itinerary.path[itinerary.path.length - 1][1]
                          }}
                          title={`Arrivée ${itinerary.title}`}
                        >
                          <View style={[styles.endMarker, { borderColor: itinerary.color }]}
                          >
                            <Ionicons name="flag" size={16} color={itinerary.color} />
                          </View>
                        </Marker>
                      </React.Fragment>
                    ))}
                  </MapView>
                </View>

                {/* Liste des itinéraires sélectionnables */}
                <View style={styles.itinerariesList}>
                  {MOCK_PROPOSED_ITINERAIRES.map((itinerary) => (
                    <TouchableOpacity
                      key={itinerary.id}
                      style={[
                        styles.itineraryCard,
                        selectedItinerary === itinerary.id && styles.selectedItineraryCard,
                        { borderLeftColor: itinerary.color }
                      ]}
                      onPress={() => handleItinerarySelect(itinerary.id)}
                    >
                      <View style={styles.itineraryHeader}>
                        <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                        <View style={styles.itineraryBadge}>
                          <View style={[styles.colorDot, { backgroundColor: itinerary.color }]} />
                        </View>
                      </View>
                      
                      <Text style={styles.itineraryDescription}>{itinerary.description}</Text>
                      
                      <View style={styles.itineraryStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="time" size={16} color="#666" />
                          <Text style={styles.statText}>{itinerary.duration}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="car" size={16} color="#666" />
                          <Text style={styles.statText}>{itinerary.distance}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="wallet" size={16} color="#666" />
                          <Text style={styles.statText}>{itinerary.budget}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.highlightsContainer}>
                        <Text style={styles.highlightsLabel}>Points forts :</Text>
                        <Text style={styles.highlightsText}>
                          {itinerary.highlights.join(" • ")}
                        </Text>
                      </View>
                      
                      {selectedItinerary === itinerary.id && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={20} color={itinerary.color} />
                          <Text style={[styles.selectedText, { color: itinerary.color }]}
                          >
                            Sélectionné
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.resultsFooter}>
                  <TouchableOpacity 
                    style={styles.backToFormButton}
                    onPress={() => setShowResults(false)}
                  >
                    <Ionicons name="arrow-back" size={20} color="#34573E" />
                    <Text style={styles.backToFormText}>Modifier mes critères</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }

    // 1. Question sur le type de date
    if (step === 0) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Quand souhaites-tu partir ?</Text>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => { setDateType("precise"); setStep(1); setRange({ start: null, end: null }); }}
                            >
                                <Text style={styles.choiceButtonText}>J'ai une date précise</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => { setDateType("approx"); setStep(1); setRange({ start: null, end: null }); }}
                            >
                                <Text style={styles.choiceButtonText}>J'ai une date approximative</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.navContainer}>
                            <View style={{ width: 48 }} />
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "6.5%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Étape 1 : Sélection de date précise OU date approximative (découpée en 2 sous-étapes)
    if (step === 1 && dateType === "precise") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>
                                    Sélectionne ta date de départ et d'arrivée
                                </Text>
                                <Calendar
                                    markingType={'period'}
                                    markedDates={getMarkedDates(range.start, range.end)}
                                    onDayPress={day => {
                                        if (!range.start || (range.start && range.end)) {
                                            setRange({ start: day.dateString, end: null });
                                            setApproxDays(null);
                                        } else if (range.start && !range.end) {
                                            if (day.dateString > range.start) {
                                                setRange({ start: range.start, end: day.dateString });
                                            } else {
                                                setRange({ start: day.dateString, end: null });
                                                setApproxDays(null);
                                            }
                                        }
                                    }}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    style={{ alignSelf: "center", marginBottom: 20 }}
                                />
                            </View>
                        </ScrollView>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => { setStep(0); setDateType(null); setRange({ start: null, end: null }); setApproxDays(null); setApproxStep(1); }} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(2)}
                                style={[
                                    styles.navButton,
                                    {
                                        opacity:
                                            range.start &&
                                                range.end
                                                ? 1
                                                : 0.5
                                    }
                                ]}
                                disabled={
                                    !range.start ||
                                    !range.end
                                }
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "13%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Étape 1A : Sélection de la période (date approximative)
    if (step === 1 && dateType === "approx" && approxStep === 1) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>Sélectionne ta période approximative</Text>
                                <Calendar
                                    markingType={'period'}
                                    markedDates={getMarkedDates(range.start, range.end)}
                                    onDayPress={day => {
                                        if (!range.start || (range.start && range.end)) {
                                            setRange({ start: day.dateString, end: null });
                                        } else if (range.start && !range.end) {
                                            if (day.dateString > range.start) {
                                                setRange({ start: range.start, end: day.dateString });
                                            } else {
                                                setRange({ start: day.dateString, end: null });
                                            }
                                        }
                                    }}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    style={{ alignSelf: "center", marginBottom: 20 }}
                                />
                            </View>
                        </ScrollView>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => { setStep(0); setDateType(null); setRange({ start: null, end: null }); setApproxDays(null); setApproxStep(1); }} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setApproxStep(2)}
                                style={[
                                    styles.navButton,
                                    { opacity: range.start && range.end ? 1 : 0.5 }
                                ]}
                                disabled={!range.start || !range.end}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "10%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Étape 1B : Sélection du nombre de jours (date approximative)
    if (step === 1 && dateType === "approx" && approxStep === 2) {
        const diff = range.start && range.end
            ? Math.floor((new Date(range.end).getTime() - new Date(range.start).getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>Nombre de jours dans cette période :</Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {Array.from({ length: diff - 1 }, (_, i) => i + 1).map(i => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[
                                                styles.choiceButton,
                                                approxDays === i && styles.choiceButtonSelected,
                                                { minWidth: 60, marginRight: 8, marginBottom: 8, paddingVertical: 8 }
                                            ]}
                                            onPress={() => setApproxDays(i)}
                                        >
                                            <Text style={[
                                                styles.choiceButtonText,
                                                approxDays === i && styles.choiceButtonTextSelected
                                            ]}>{i}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setApproxStep(1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(2)}
                                style={[
                                    styles.navButton,
                                    { opacity: approxDays ? 1 : 0.5 }
                                ]}
                                disabled={!approxDays}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "13%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // 3. Suite du questionnaire classique (exemple)
    // Remplace par tes vraies questions
    // step >= 2
    if (step === 2) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>D'où pars-tu ?</Text>
                            <View style={{ width: "100%", marginBottom: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10 }}>
                                    <Ionicons name="search" size={20} color="#888" />
                                    <TextInput
                                        style={{ flex: 1, height: 40, marginLeft: 8 }}
                                        placeholder="Rechercher un lieu"
                                        value={search}
                                        onChangeText={setSearch}
                                        onSubmitEditing={handleSearch}
                                        returnKeyType="search"
                                    />
                                    <TouchableOpacity onPress={handleSearch}>
                                        <Ionicons name="arrow-forward" size={22} color="#FF9900" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Carte interactive */}
                            <View style={{ width: "100%", height: 250, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
                                <MapView
                                    style={{ flex: 1 }}
                                    region={region}
                                    onPress={e => setDeparture(e.nativeEvent.coordinate)}
                                >
                                    {departure && (
                                        <Marker coordinate={departure} />
                                    )}
                                </MapView>
                            </View>
                            <Text style={{ color: "#34573E", marginBottom: 10 }}>
                                {departure
                                    ? `Point choisi : ${departure.latitude.toFixed(4)}, ${departure.longitude.toFixed(4)}`
                                    : "Appuie sur la carte pour choisir ton point de départ"}
                            </Text>
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: departure ? 1 : 0.5 }]}
                                disabled={!departure}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "20%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 3) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>As-tu déjà un van pour le voyage ?</Text>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => setStep(step + 1)}
                            >
                                <Text style={styles.choiceButtonText}>Oui, j'ai mon propre van</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => {
                                    alert("N'oublie pas de consulter les tarifs avantageux de nos partenaires pour la location de van !");
                                    setStep(step + 1);
                                }}
                            >
                                <Text style={styles.choiceButtonText}>Oui, j'ai loué un van</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => {
                                    alert("Découvre nos partenaires pour louer un van au meilleur prix !");
                                    setStep(step + 1);
                                }}
                            >
                                <Text style={styles.choiceButtonText}>Non, je cherche à louer un van</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ width: 48 }} />
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "26%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (showPartner === "info") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Nos partenaires location van</Text>
                            <Text style={{ color: "#34573E", textAlign: "center", marginBottom: 20 }}>
                                Profite de tarifs avantageux chez nos partenaires pour la location de van.{"\n"}
                                Exemple : VanLiberté - à partir de 59€/jour, RoadSurfer - à partir de 65€/jour.
                            </Text>
                            {/* Tu peux ajouter logos, liens, etc. */}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setShowPartner(null)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setShowPartner(null);
                                if (previousStep !== null) setStep(previousStep + 1);
                            }} style={styles.navButton}>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "30%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (showPartner === "rent") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Loue ton van avec nos partenaires</Text>
                            <Text style={{ color: "#34573E", textAlign: "center", marginBottom: 20 }}>
                                Tu n'as pas encore de van ? Découvre nos partenaires et réserve facilement !
                                <br />Exemple : VanLiberté - à partir de 59€/jour, RoadSurfer - à partir de 65€/jour.
                            </Text>
                            {/* Tu peux ajouter logos, liens, etc. */}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setShowPartner(null)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setShowPartner(null);
                                if (previousStep !== null) setStep(previousStep + 1);
                            }} style={styles.navButton}>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "30%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 4) {
        const options = [
            "Seul(e)",
            "En couple",
            "En famille",
            "Entre amis",
            "Avec un animal de compagnie"
        ];

        const toggleCompanion = (option: string) => {
            setCompanions(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };

        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Avec qui tu voyages ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        companions.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => toggleCompanion(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        companions.includes(option) && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: companions.length > 0 ? 1 : 0.5 }]}
                                disabled={companions.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "33%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Question 5 : Jusqu'où veux-tu aller ?
    if (step === 5) {
        const options = [
            "Je reste dans la même région",
            "Plusieurs régions",
            "Changer de pays"
        ];

        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Jusqu'où veux-tu aller ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        distance === option && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setDistance(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        distance === option && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: distance ? 1 : 0.5 }]}
                                disabled={!distance}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "39%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Question 6 : Quel rythme préfères-tu ?
    if (step === 6) {
        const options = [
            "Chill (peu de trajet)",
            "Équilibré",
            "Roadtrip intense (beaucoup de spots)"
        ];

        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Quel rythme préfères-tu ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        rythm === option && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setRythm(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        rythm === option && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: rythm ? 1 : 0.5 }]}
                                disabled={!rythm}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "45%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 7) {
        const options = [
            "Nature sauvage",
            "Montagnes",
            "Plages",
            "Villes / culture",
            "Spots secrets & insolites"
        ];

        const togglePlace = (option: string) => {
            setPlaces(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };

        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Quels types de lieux veux-tu explorer ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        places.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => togglePlace(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        places.includes(option) && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: places.length > 0 ? 1 : 0.5 }]}
                                disabled={places.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "50%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 8) {
        const options = [
            "Déconnexion & nature",
            "Slow travel",
            "Romantique",
            "Festive / sociale",
            "Familiale"
        ];
        const toggleAmbiance = (option: string) => {
            setAmbiance(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Ambiance recherchée :</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        ambiance.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => toggleAmbiance(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        ambiance.includes(option) && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: ambiance.length > 0 ? 1 : 0.5 }]}
                                disabled={ambiance.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "56%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 9) {
        const options = [
            "Moins de 20 €",
            "20 € à 40 €",
            "40 € à 70 €",
            "Plus de 70 €"
        ];
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Quel est ton budget moyen par jour (par personne) ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        budget === option && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setBudget(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        budget === option && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: budget ? 1 : 0.5 }]}
                                disabled={!budget}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "62%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 10) {
        const options = [
            "100 % gratuits",
            "Mix gratuits & payants",
            "Avec services (douche, vidange…)",
            "Calmes pour télétravail ou repos"
        ];
        const toggleSpotType = (option: string) => {
            setSpotType(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Souhaites-tu des spots :</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        spotType.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => toggleSpotType(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        spotType.includes(option) && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: spotType.length > 0 ? 1 : 0.5 }]}
                                disabled={spotType.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "69%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (step === 11) {
        const options = [
            "Rando",
            "Baignade / sports nautiques",
            "Visites culturelles",
            "Détente Zen",
            "Sport",
            "Gastronomie locale",
            "Activité extrême"
        ];
        const toggleActivity = (option: string) => {
            setActivities(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Qu’aimerais-tu faire pendant ce voyage ?</Text>
                            <ScrollView
                                style={{ maxHeight: 260, width: "100%" }}
                                contentContainerStyle={{ alignItems: "center", paddingBottom: 10 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {options.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.choiceButton,
                                            activities.includes(option) && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => toggleActivity(option)}
                                    >
                                        <Text style={[
                                            styles.choiceButtonText,
                                            activities.includes(option) && styles.choiceButtonTextSelected
                                        ]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: activities.length > 0 ? 1 : 0.5 }]}
                                disabled={activities.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${((step + 1) / 16) * 100}%` }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Question Ambiance recherchée (choix multiples)
    if (step === 12) {
        const options = [
            "Déconnexion & nature",
            "Slow travel",
            "Romantique",
            "Festive / sociale",
            "Familiale"
        ];
        const toggleAmbiance = (option: string) => {
            setAmbiance(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Ambiance recherchée :</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        ambiance.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => toggleAmbiance(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        ambiance.includes(option) && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: ambiance.length > 0 ? 1 : 0.5 }]}
                                disabled={ambiance.length === 0}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "82%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Question itinéraire écoresponsable (choix unique)
    if (step === 13) {
        const options = [
            "Oui",
            "Un bon équilibre",
            "Non prioritaire"
        ];
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Souhaites-tu un itinéraire écoresponsable ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        eco === option && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setEco(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        eco === option && styles.choiceButtonTextSelected
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setStep(step + 1)}
                                style={[styles.navButton, { opacity: eco ? 1 : 0.5 }]}
                                disabled={!eco}
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "92%" }]} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Question contraintes/besoins particuliers (choix multiples)
    if (step === 14) {
        const options = [
            "Animaux",
            "Kids friendly", 
            "Pas d'autoroute",
            "PMR"
        ];
        const toggleConstraint = (option: string) => {
            setConstraints(prev =>
                prev.includes(option)
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        };
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.greenPart}>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "100%" }]} />
                        </View>

                        <View style={styles.questionContainer}>
                            <Text style={styles.questionText}>Des contraintes particulières ?</Text>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        constraints.includes(option) && styles.choiceButtonSelected,
                                    ]}
                                    onPress={() => toggleConstraint(option)}
                                >
                                    <Text
                                        style={[
                                            styles.choiceButtonText,
                                            constraints.includes(option) && styles.choiceButtonTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.navContainer}>
                          <TouchableOpacity style={styles.navButton} onPress={() => setStep(13)}>
                            <Ionicons name="arrow-back" size={20} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.navButton} onPress={logAnswers}>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/images/pexels-lum3n-44775-167684.jpeg')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.greenPart}>
                    <Text style={styles.questionText}>Questionnaire terminé !</Text>
                    <TouchableOpacity style={styles.choiceButton} onPress={onClose}>
                        <Text style={styles.choiceButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#82A189",
    },
    backgroundImage: {
        width: "100%",
        height: BG_HEIGHT,
        justifyContent: "flex-start",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 6,
    },
    greenPart: {
        flex: 1,
        backgroundColor: "#82A189",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
        padding: 24,
        justifyContent: "space-between",
    },
    questionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    questionText: {
        fontSize: 22,
        color: "#34573E",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
    choiceButton: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
        alignSelf: "stretch",         // <-- Ajouté
        width: "100%",                // <-- Ajouté
        maxWidth: 400,                // <-- Optionnel pour limiter la largeur sur tablette/desktop
        minWidth: 200,                // <-- Optionnel pour éviter des boutons trop petits
        marginHorizontal: "auto",     // <-- Centre le bouton si maxWidth est atteint
    },
    choiceButtonSelected: {
        borderColor: "#FF9900",
        backgroundColor: "#FFFAF0",
    },
    choiceButtonText: {
        color: "#34573E",
        fontWeight: "bold",
        fontSize: 17,
    },
    choiceButtonTextSelected: {
        color: "#FF9900",
    },
    navContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    navButton: {
        backgroundColor: "#34573E",
        borderRadius: 20,
        padding: 12,
        marginHorizontal: 10,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: "#bec4c7",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#FF9900",
        borderRadius: 4,
    },
    
    // ✅ Nouveaux styles pour l'étape résultats
    mapContainer: {
      height: 250,
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    resultsMap: {
      flex: 1,
    },
    startMarker: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 6,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    endMarker: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 6,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    itinerariesList: {
      gap: 15,
      marginBottom: 20,
    },
    itineraryCard: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 16,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    selectedItineraryCard: {
      backgroundColor: '#f8fff8',
      shadowOpacity: 0.2,
      elevation: 6,
    },
    itineraryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    itineraryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#34573E',
      flex: 1,
    },
    itineraryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    itineraryDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
      lineHeight: 20,
    },
    itineraryStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statText: {
      fontSize: 12,
      color: '#666',
      fontWeight: 'bold',
    },
    highlightsContainer: {
      marginBottom: 8,
    },
    highlightsLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#34573E',
      marginBottom: 4,
    },
    highlightsText: {
      fontSize: 12,
      color: '#666',
      lineHeight: 16,
    },
    selectedIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      gap: 6,
    },
    selectedText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    resultsFooter: {
      alignItems: 'center',
      marginTop: 10,
    },
    backToFormButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      gap: 6,
    },
    backToFormText: {
      color: '#34573E',
      fontWeight: 'bold',
      fontSize: 14,
    },
});