import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Region, Callout } from 'react-native-maps'; // ✅ Ajouter Callout à l'import
import { Itineraire } from '../types/Itineraire';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ItinerairesMapProps {
  itineraires: Itineraire[];
  onItineraireSelect: (itineraire: Itineraire) => void;
}

export default function ItinerairesMap({ itineraires, onItineraireSelect }: ItinerairesMapProps) {
  const [selectedItineraireId, setSelectedItineraireId] = useState<string | null>(null);

  // Région centrée sur la France
  const initialRegion: Region = {
    latitude: 46.2276,
    longitude: 2.2137,
    latitudeDelta: 6.0,
    longitudeDelta: 6.0,
  };

  const getItineraireColor = (index: number) => {
    const colors = ['#FF9900', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722'];
    return colors[index % colors.length];
  };

  const getItineraireCenter = (itineraire: Itineraire) => {
    if (!itineraire.waypoints || itineraire.waypoints.length === 0) {
      return { latitude: 46.2276, longitude: 2.2137 };
    }

    const waypoints = itineraire.waypoints.sort((a, b) => a.order - b.order);
    const latitudes = waypoints.map(w => w.latitude);
    const longitudes = waypoints.map(w => w.longitude);

    return {
      latitude: latitudes.reduce((a, b) => a + b, 0) / latitudes.length,
      longitude: longitudes.reduce((a, b) => a + b, 0) / longitudes.length,
    };
  };

  const getRouteCoordinates = (itineraire: Itineraire) => {
    if (!itineraire.waypoints || itineraire.waypoints.length === 0) {
      return [];
    }

    // Utiliser le path détaillé si disponible
    if (itineraire.detailedRoute && 
        itineraire.detailedRoute.path && 
        itineraire.detailedRoute.path.length > 0) {
      try {
        return itineraire.detailedRoute.path
          .filter(point => Array.isArray(point) && point.length >= 2)
          .map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));
      } catch (error) {
        console.warn('Erreur path détaillé:', error);
      }
    }

    // Fallback vers les waypoints
    return itineraire.waypoints
      .sort((a, b) => a.order - b.order)
      .map(w => ({
        latitude: w.latitude,
        longitude: w.longitude
      }));
  };

  const handleMarkerPress = (itineraire: Itineraire) => {
    setSelectedItineraireId(itineraire.id);
  };

  const handleCalloutPress = (itineraire: Itineraire) => {
    onItineraireSelect(itineraire);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="map" size={24} color="#34573E" />
        <Text style={styles.title}>Itinéraires autour de vous</Text>
      </View>
      
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
        {/* Tracés des itinéraires */}
        {itineraires.map((itineraire, index) => {
          const coordinates = getRouteCoordinates(itineraire);
          if (coordinates.length < 2) return null;

          return (
            <Polyline
              key={`route-${itineraire.id}`}
              coordinates={coordinates}
              strokeColor={getItineraireColor(index)}
              strokeWidth={selectedItineraireId === itineraire.id ? 5 : 3}
              lineJoin="round"
              lineCap="round"
            />
          );
        })}

        {/* Markers pour chaque itinéraire */}
        {itineraires.map((itineraire, index) => {
          const center = getItineraireCenter(itineraire);
          const color = getItineraireColor(index);

          return (
            <Marker
              key={`marker-${itineraire.id}`}
              coordinate={center}
              onPress={() => handleMarkerPress(itineraire)}
              pinColor={color}
            >
              <View style={[styles.customMarker, { borderColor: color }]}>
                <MaterialIcons name="route" size={20} color={color} />
              </View>
              
              {selectedItineraireId === itineraire.id && (
                <Callout
                  style={styles.callout}
                  onPress={() => handleCalloutPress(itineraire)}
                >
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutTitle}>{itineraire.nom}</Text>
                    <Text style={styles.calloutDescription} numberOfLines={2}>
                      {itineraire.description}
                    </Text>
                    <View style={styles.calloutInfos}>
                      <View style={styles.calloutInfo}>
                        <Ionicons name="time" size={14} color="#666" />
                        <Text style={styles.calloutInfoText}>{itineraire.duree}</Text>
                      </View>
                      <View style={styles.calloutInfo}>
                        <Ionicons name="car" size={14} color="#666" />
                        <Text style={styles.calloutInfoText}>{itineraire.distance}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>Voir l'itinéraire</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              )}
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34573E',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34573E',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    lineHeight: 16,
  },
  calloutInfos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calloutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calloutInfoText: {
    fontSize: 11,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});