import { Tabs } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
        tabBarLabelStyle: {
          fontSize: 8, 
        },
      }}
    >
      <Tabs.Screen 
        name="acceuil" 
        options={{ 
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="spots" 
        options={{ 
          title: "Spots",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="place" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="itineraires" 
        options={{ 
          title: "Itinéraires",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="communaute" 
        options={{ 
          title: "Communauté",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profil" 
        options={{ 
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
