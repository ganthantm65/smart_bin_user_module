import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function GlassCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  }
});