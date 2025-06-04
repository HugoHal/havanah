import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground, Dimensions, SafeAreaView, ScrollView, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';

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
    };

    // 1. Question sur le type de date
    if (step === 0) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    // Étape 1 : Sélection de date précise OU date approximative (découpée en 2 sous-étapes)
    if (step === 1 && dateType === "precise") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                                                range.end &&
                                                (dateType === "precise" || (dateType === "approx" && approxDays))
                                                ? 1
                                                : 0.5
                                    }
                                ]}
                                disabled={
                                    !range.start ||
                                    !range.end ||
                                    (dateType === "approx" && !approxDays)
                                }
                            >
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "13%" }]} />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    // Étape 1A : Sélection de la période (date approximative)
    if (step === 1 && dateType === "approx" && approxStep === 1) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    // 3. Suite du questionnaire classique (exemple)
    // Remplace par tes vraies questions
    // step >= 2
    if (step === 2) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    if (step === 3) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    if (showPartner === "info") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    if (showPartner === "rent") {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
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
                <SafeAreaView style={styles.container}>
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
                </SafeAreaView>
            </Modal>
        );
    }

    // Question contraintes/besoins particuliers (choix multiples)
    if (step === 14) {
        const options = [
            "Animaux",
            "Kids friendly",
            "Pas d’autoroute",
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
                <SafeAreaView style={styles.container}>
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
                            <Text style={styles.questionText}>As-tu des contraintes ou besoins particuliers ?</Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.choiceButton,
                                        constraints.includes(option) && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => toggleConstraint(option)}
                                >
                                    <Text style={[
                                        styles.choiceButtonText,
                                        constraints.includes(option) && styles.choiceButtonTextSelected
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
                                onPress={() => {
                                    // Ici tu peux gérer la fin du questionnaire
                                    logAnswers();
                                    onClose();
                                    resetForm();
                            }}
                            style={[styles.navButton, { opacity: 1 }]}
                        >
                            <Ionicons name="checkmark" size={24} color="#fff" />
                        </TouchableOpacity>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: "100%" }]} />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
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
                        <Text style={styles.questionText}>Autres questions ici…</Text>
                        {/* ... */}
                    </View>
                    <View style={styles.navContainer}>
                        <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* ... */ }} style={styles.navButton}>
                            <Ionicons name="arrow-forward" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: "60%" }]} />
                    </View>
                </View>
            </SafeAreaView>
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
});