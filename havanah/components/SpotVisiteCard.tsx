import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SpotVisite } from '../types/User';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SpotVisiteCardProps {
  spotVisite: SpotVisite;
}

export default function SpotVisiteCard({ spotVisite }: SpotVisiteCardProps) {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Date inconnue';
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? 'Date inconnue' : d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.spotInfo}>
          <Ionicons name="location" size={18} color="#FF9900" />
          <Text style={styles.spotName}>{spotVisite.nom}</Text>
        </View>
        <Text style={styles.date}>
          {formatDate(spotVisite.date_visite)}
        </Text>
      </View>
      <Text style={styles.description}>{spotVisite.description}</Text>
      {/* Ajoute d'autres infos si besoin */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  commentaire: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  photosIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photosCount: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
});