import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CO2BadgeProps {
  co2Economise: number;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function CO2Badge({ co2Economise, style, size = 'medium' }: CO2BadgeProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          icon: 14,
          text: styles.textSmall,
          value: styles.valueSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          icon: 20,
          text: styles.textLarge,
          value: styles.valueLarge,
        };
      default:
        return {
          container: styles.container,
          icon: 16,
          text: styles.text,
          value: styles.value,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[sizeStyles.container, style]}>
      <Ionicons name="leaf" size={sizeStyles.icon} color="#4CAF50" />
      <Text style={sizeStyles.value}>{co2Economise ?? 0}</Text>
      <Text style={sizeStyles.text}>kg CO₂</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  containerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  containerLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  valueSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  valueLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  text: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  textLarge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});