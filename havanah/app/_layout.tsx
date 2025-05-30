import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";

export default function TabsLayout() {
  const [fontsLoaded] = useFonts({
    'Castoro': require('../assets/fonts/CastoroTitling-Regular.ttf'),
    // Ajoute d'autres variantes si besoin
    // 'MaPolice-Bold': require('../assets/fonts/NOM_DE_TA_POLICE-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="acceuil" options={{ title: "Accueil" }} />
      <Tabs.Screen name="spots" options={{ title: "Spots" }} />
      <Tabs.Screen name="itineraires" options={{ title: "Itinéraires" }} />
      <Tabs.Screen name="communaute" options={{ title: "Communauté" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
    </Tabs>
  );
}
