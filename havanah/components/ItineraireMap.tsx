import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Itineraire, Waypoint } from '../types/Itineraire';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ItineraireMapProps {
  itineraire: Itineraire;
  showRoute?: boolean;
}

export default function ItineraireMap({ itineraire, showRoute = true }: ItineraireMapProps) {
  if (!itineraire.waypoints || itineraire.waypoints.length === 0) {
    return null;
  }

  const waypoints = itineraire.waypoints.sort((a, b) => a.order - b.order);
  
  // Vérifier si on a une route détaillée valide
  const hasDetailedRoute = itineraire.detailedRoute && 
                          itineraire.detailedRoute.path && 
                          Array.isArray(itineraire.detailedRoute.path) && 
                          itineraire.detailedRoute.path.length > 0;

  // Calculer la région de la carte basée sur le path détaillé ou les waypoints
  const getMapRegion = () => {
    let coordinates: { latitude: number; longitude: number }[] = [];
    
    // Si on a un path détaillé valide, l'utiliser pour calculer la région
    if (hasDetailedRoute) {
      try {
        coordinates = itineraire.detailedRoute!.path
          .filter(point => Array.isArray(point) && point.length >= 2) // ✅ Filtrer d'abord
          .map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));
        
        console.log(`Points valides trouvés: ${coordinates.length}/${itineraire.detailedRoute!.path.length}`);
      } catch (error) {
        console.warn('Erreur lors du traitement du path détaillé:', error);
        // Fallback vers les waypoints en cas d'erreur
        coordinates = waypoints.map(w => ({
          latitude: w.latitude,
          longitude: w.longitude
        }));
      }
    } else {
      // Utiliser les waypoints
      coordinates = waypoints.map(w => ({
        latitude: w.latitude,
        longitude: w.longitude
      }));
    }
    
    if (coordinates.length === 0) {
      // Région par défaut si aucune coordonnée
      return {
        latitude: 43.6108,
        longitude: 3.8767,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    
    const latitudes = coordinates.map(c => c.latitude);
    const longitudes = coordinates.map(c => c.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    // Ajouter une marge de 10% autour
    const latDelta = (maxLat - minLat) * 1.1;
    const lngDelta = (maxLng - minLng) * 1.1;
    
    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum de zoom
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const region = getMapRegion();

  const getMarkerColor = (type: Waypoint['type']) => {
    switch (type) {
      case 'departure': return '#4CAF50';
      case 'destination': return '#F44336';
      case 'stop': return '#FF9800';
      default: return '#2196F3';
    }
  };

  const getMarkerIcon = (type: Waypoint['type']) => {
    switch (type) {
      case 'departure': return 'play-arrow';
      case 'destination': return 'flag';
      case 'stop': return 'pause';
      default: return 'place';
    }
  };

  // Fonction pour créer les coordonnées de la polyline
  const getRouteCoordinates = () => {
    if (hasDetailedRoute) {
      try {
        // Utiliser le path détaillé en filtrant les points valides
        const validCoordinates = itineraire.detailedRoute!.path
          .filter(point => Array.isArray(point) && point.length >= 2) // ✅ Filtrer
          .map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));
        
        console.log(`Polyline: ${validCoordinates.length} points valides`);
        return validCoordinates;
      } catch (error) {
        console.warn('Erreur lors du traitement du path pour la polyline:', error);
        // Fallback vers les waypoints
        return waypoints.map(w => ({
          latitude: w.latitude,
          longitude: w.longitude
        }));
      }
    } else if (waypoints.length > 1) {
      // Fallback vers les waypoints simples
      return waypoints.map(w => ({
        latitude: w.latitude,
        longitude: w.longitude
      }));
    }
    return [];
  };

  const routeCoordinates = getRouteCoordinates();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
      >
        {/* Tracé de l'itinéraire */}
        {showRoute && routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF9900"
            strokeWidth={hasDetailedRoute ? 4 : 3} // Plus épais si route détaillée
            lineDashPattern={hasDetailedRoute ? undefined : [5, 5]} // Pointillés si pas de route détaillée
            lineJoin="round"
            lineCap="round"
          />
        )}
        
        {/* Markers pour chaque waypoint */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={waypoint.id}
            coordinate={{
              latitude: waypoint.latitude,
              longitude: waypoint.longitude
            }}
            title={waypoint.name}
            description={waypoint.description}
            zIndex={1000} // S'assurer que les markers sont au-dessus de la ligne
          >
            <View style={[
              styles.customMarker,
              { borderColor: getMarkerColor(waypoint.type) }
            ]}>
              <MaterialIcons 
                name={getMarkerIcon(waypoint.type)} 
                size={20} 
                color={getMarkerColor(waypoint.type)} 
              />
              <View style={[styles.markerNumber, { backgroundColor: getMarkerColor(waypoint.type) }]}>
                <Text style={styles.markerNumberText}>{index + 1}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
      
      {/* Légende pour indiquer le type de tracé */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[
            styles.legendLine, 
            { 
              backgroundColor: '#FF9900',
              height: hasDetailedRoute ? 4 : 3,
            }
          ]} />
          <Text style={styles.legendText}>
            {hasDetailedRoute ? 'Tracé précis' : 'Tracé approximatif'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
  },
  markerNumber: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerNumberText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legend: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLine: {
    width: 20,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});