import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { DetailedRoute, RouteInstruction } from '../types/Itineraire';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface NavigationViewProps {
  route: DetailedRoute;
  currentInstructionIndex?: number;
  onInstructionSelect?: (index: number) => void;
}

export default function NavigationView({ 
  route, 
  currentInstructionIndex = 0, 
  onInstructionSelect 
}: NavigationViewProps) {
  const [showInstructions, setShowInstructions] = useState(true);

  // Calculer la région de la carte
  const getMapRegion = () => {
    const latitudes = route.path.map(point => point[0]);
    const longitudes = route.path.map(point => point[1]);
    
    return {
      latitude: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
      longitude: (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
      latitudeDelta: Math.max(...latitudes) - Math.min(...latitudes) + 0.01,
      longitudeDelta: Math.max(...longitudes) - Math.min(...longitudes) + 0.01,
    };
  };

  // Obtenir l'icône pour le type d'instruction
  const getInstructionIcon = (sign: number) => {
    switch (sign) {
      case -3: return 'turn-sharp-left';
      case -2: return 'turn-left';
      case -1: return 'turn-slight-left';
      case 0: return 'straight';
      case 1: return 'turn-slight-right';
      case 2: return 'turn-right';
      case 3: return 'turn-sharp-right';
      case 4: return 'flag'; // Arrivée
      case 6: return 'radio-button-off'; // Rond-point
      default: return 'navigate';
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h${minutes.toString().padStart(2, '0')}`;
    return `${minutes}min`;
  };

  return (
    <View style={styles.container}>
      {/* Carte avec tracé précis */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={getMapRegion()}>
          {/* Tracé de la route complète */}
          <Polyline
            coordinates={route.path.map(point => ({
              latitude: point[0],
              longitude: point[1]
            }))}
            strokeColor="#FF9900"
            strokeWidth={5}
          />
          
          {/* Marqueurs pour les instructions importantes */}
          {route.instructions
            .filter(instruction => instruction.sign !== 0) // Exclure "tout droit"
            .map((instruction, index) => {
              const pathIndex = instruction.interval[0];
              if (pathIndex < route.path.length) {
                const coord = route.path[pathIndex];
                return (
                  <Marker
                    key={index}
                    coordinate={{ latitude: coord[0], longitude: coord[1] }}
                    title={instruction.text}
                  >
                    <View style={styles.instructionMarker}>
                      <MaterialIcons 
                        name={getInstructionIcon(instruction.sign)} 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                  </Marker>
                );
              }
              return null;
            })}
        </MapView>
        
        {/* Bouton pour basculer les instructions */}
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowInstructions(!showInstructions)}
        >
          <Ionicons 
            name={showInstructions ? 'list' : 'map'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Liste des instructions */}
      {showInstructions && (
        <ScrollView style={styles.instructionsContainer}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>Instructions de navigation</Text>
            <Text style={styles.routeStats}>
              {formatDistance(route.distance)} • {formatDuration(route.duration)}
            </Text>
          </View>
          
          {route.instructions.map((instruction, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.instructionItem,
                index === currentInstructionIndex && styles.currentInstruction
              ]}
              onPress={() => onInstructionSelect?.(index)}
            >
              <View style={styles.instructionIcon}>
                <MaterialIcons 
                  name={getInstructionIcon(instruction.sign)} 
                  size={24} 
                  color={index === currentInstructionIndex ? "#FF9900" : "#34573E"} 
                />
              </View>
              
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>{instruction.text}</Text>
                <View style={styles.instructionDetails}>
                  {instruction.street_name && (
                    <Text style={styles.streetName}>📍 {instruction.street_name}</Text>
                  )}
                  <Text style={styles.instructionDistance}>
                    {formatDistance(instruction.distance)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#34573E',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  instructionMarker: {
    backgroundColor: '#FF9900',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  instructionsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  routeHeader: {
    backgroundColor: '#34573E',
    padding: 15,
    alignItems: 'center',
  },
  routeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeStats: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 1,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  currentInstruction: {
    borderLeftColor: '#FF9900',
    backgroundColor: '#FFF8F0',
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  instructionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streetName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  instructionDistance: {
    fontSize: 12,
    color: '#FF9900',
    fontWeight: 'bold',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34573E',
    backgroundColor: '#E7D4BB',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 30,
    textAlign: 'center',
  },
});