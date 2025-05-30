// components/CarteSpots.tsx
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, ActivityIndicator, Alert, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useSpots } from "../hooks/useSpots";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CarteSpots() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const { spots, loading: spotsLoading } = useSpots();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Localisation requise.");
        setLocationLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLocationLoading(false);
    })();
  }, []);

  const handleMapReady = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  // Fonction pour créer un marker personnalisé
  const getCustomMarker = (type: string) => {
    const markerStyle = {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 8,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    };

    switch (type) {
      case 'camping':
        return (
          <View style={[markerStyle, { borderColor: '#4CAF50' }]}>
            <FontAwesome5 name="campground" size={20} color="#4CAF50" />
          </View>
        );
      case 'aire_services':
        return (
          <View style={[markerStyle, { borderColor: '#2196F3' }]}>
            <MaterialIcons name="local-gas-station" size={20} color="#2196F3" />
          </View>
        );
      case 'stationnement':
        return (
          <View style={[markerStyle, { borderColor: '#FF9800' }]}>
            <FontAwesome5 name="caravan" size={20} color="#FF9800" />
          </View>
        );
      case 'point_eau':
        return (
          <View style={[markerStyle, { borderColor: '#00BCD4' }]}>
            <Ionicons name="water" size={20} color="#00BCD4" />
          </View>
        );
      default:
        return (
          <View style={[markerStyle, { borderColor: '#9C27B0' }]}>
            <MaterialIcons name="place" size={20} color="#9C27B0" />
          </View>
        );
    }
  };

  if (locationLoading || !location) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
      onMapReady={handleMapReady}
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          title={spot.nom}
          description={`${spot.description} - ${spot.prix ? `${spot.prix}€` : 'Gratuit'}`}
        >
          {getCustomMarker(spot.type)}
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 20,
  },
});
