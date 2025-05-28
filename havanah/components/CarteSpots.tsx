// components/CarteSpots.tsx
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function CarteSpots() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null); // Typage MapView

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Localisation requise.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
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

  if (loading || !location) {
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
      {/* Tu pourras ajouter ici : des Markers pour les spots, une heatmap, un bouton danger, etc. */}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 15,
  },
});
