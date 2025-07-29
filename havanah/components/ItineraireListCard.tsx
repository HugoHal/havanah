import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ItineraireUser } from '../types/User';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CO2Badge from './CO2Badge'; // ✅ Import ajouté

interface ItineraireListCardProps {
  itineraire: ItineraireUser;
  showCompleted?: boolean;
}

export default function ItineraireListCard({ itineraire, showCompleted = false, onPress }: ItineraireListCardProps & { onPress?: () => void }) {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Date inconnue';
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? 'Date inconnue' : d.toLocaleDateString('fr-FR');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{itineraire.nom}</Text>
          <View style={styles.badges}>
            {!itineraire.isPublic && !showCompleted && (
              <View style={styles.privateBadge}>
                <Ionicons name="lock-closed" size={12} color="#666" />
                <Text style={styles.privateText}>Privé</Text>
              </View>
            )}
            {showCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                <Text style={styles.completedText}>Terminé</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.date}>
          {formatDate(itineraire.date_visite ?? itineraire.created_at)}
        </Text>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {itineraire.description}
      </Text>
      
      <View style={styles.infos}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color="#34573E" />
          <Text style={styles.infoText}>{itineraire.duree} jours</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="car" size={16} color="#34573E" />
          <Text style={styles.infoText}>{itineraire.distance} km</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="star" size={16} color="#FF9900" />
          <Text style={styles.infoText}>{itineraire.note}/5</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="eye" size={16} color="#666" />
          <Text style={styles.infoText}>{itineraire.nbVues}</Text>
        </View>
      </View>
      
      {/* ✅ Ajout du CO2 économisé */}
      <CO2Badge co2Economise={itineraire.co2Economise} size="small" style={styles.co2Badge} />
      
      <Text style={styles.spotsCount}>
        {(itineraire.spots?.length ?? 0)} spots
        {itineraire.spots?.length > 0
          ? ` • ${itineraire.spots
              .map(s => typeof s.nom === 'string' ? s.nom : '')
              .filter(nom => nom)
              .join(', ')}`
          : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  privateText: {
    fontSize: 10,
    color: '#666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  completedText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  infos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#34573E',
    fontWeight: 'bold',
  },
  spotsCount: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  co2Badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});