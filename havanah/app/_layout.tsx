import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";

export default function TabsLayout() {
  const [fontsLoaded] = useFonts({
    'Castoro': require('../assets/fonts/CastoroTitling-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#B7CFBD", // Couleur de fond de la barre de navigation
        },
        tabBarActiveTintColor: "#34573E", // Couleur de l'onglet actif (optionnel)
        tabBarInactiveTintColor: "#82A189", // Couleur des onglets inactifs (optionnel)
      }}
    >
      <Tabs.Screen name="acceuil" options={{ title: "Accueil" }} />
      <Tabs.Screen name="spots" options={{ title: "Spots" }} />
      <Tabs.Screen name="itineraires" options={{ title: "Itinéraires" }} />
      <Tabs.Screen name="communaute" options={{ title: "Communauté" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
    </Tabs>
  );
}
