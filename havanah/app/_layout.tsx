import { Tabs } from "expo-router";

export default function TabsLayout() {
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
