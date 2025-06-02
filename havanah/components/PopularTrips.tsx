// components/PopularTrips.tsx
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type PeriodType = 'court' | 'moyen' | 'long';

interface PopularTripsProps {
  title?: string;
  subtitle?: string;
  containerStyle?: object;
  onPeriodSelect?: (period: PeriodType) => void;
}

export interface PopularTripsRef {
  resetSelection: () => void;
}

const PopularTrips = forwardRef<PopularTripsRef, PopularTripsProps>(({ 
  title = "Itinéraires populaires",
  subtitle = "Inspire toi des aventures les plus aimées de la communauté van life",
  containerStyle,
  onPeriodSelect 
}, ref) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType | null>(null);

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setSelectedPeriod(null);
    }
  }));

  const handlePeriodPress = (period: PeriodType) => {
    setSelectedPeriod(period);
    onPeriodSelect?.(period);
  };

  const getPeriodLabel = (period: PeriodType) => {
    switch (period) {
      case 'court': return 'Court\n(2-3 jours)';
      case 'moyen': return 'Moyen\n(1-2 semaines)';
      case 'long': return 'Long\n(3-4 semaines)';
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.buttonsRow}>
        {(['court', 'moyen', 'long'] as PeriodType[]).map((period) => (
          <TouchableOpacity 
            key={period}
            style={[
              styles.button,
              selectedPeriod === period && styles.buttonSelected
            ]}
            onPress={() => handlePeriodPress(period)}
          >
            <Text style={[
              styles.buttonText,
              selectedPeriod === period && styles.buttonTextSelected
            ]}>
              {getPeriodLabel(period)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

export default PopularTrips;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bec4c7", // Remplacé ici
    marginTop: 20,
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#000",
    marginBottom: 15,
    marginHorizontal: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  button: {
    backgroundColor: "#34573E",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 60,
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: "#FF9900",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 16,
  },
  buttonTextSelected: {
    color: "#000",
  },
});