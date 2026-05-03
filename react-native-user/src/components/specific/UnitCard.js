import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../common/GlassCard';
import PrimaryButton from '../common/PrimaryButton';
import { COLORS } from '../../theme/colors';

export default function UnitCard({ unit }) {
  return (
    <GlassCard style={styles.cardMargin}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{unit.location}</Text>
          {/* Changed distance to distance_km to match backend! */}
          <Text style={styles.subtitle}>{unit.distance_km}km away • {unit.id}</Text>
        </View>
        <View style={styles.unitStatusBadge}>
          <Text style={styles.unitStatusText}>{unit.status}</Text>
        </View>
      </View>

      <View style={styles.binsContainer}>
        {/* Added the optional chaining (?) right here! */}
        {unit.bins?.map((bin) => (
          <View key={bin.id} style={styles.binRow}>
            <View style={[styles.iconBox, { backgroundColor: `${bin.color}15` }]}>
              <Ionicons name={bin.icon} size={18} color={bin.color} />
            </View>
            <View style={styles.binDetails}>
              <View style={styles.labelRow}>
                <View style={styles.typeStatusRow}>
                  <Text style={styles.binType}>{bin.type}</Text>
                  <Text style={[styles.binStatusText, { color: bin.fillLevel >= 90 ? COLORS.danger : COLORS.textSecondary }]}>
                    • {bin.status}
                  </Text>
                </View>
                <Text style={[styles.percent, { color: bin.fillLevel >= 90 ? COLORS.danger : COLORS.text }]}>
                  {bin.fillLevel}%
                </Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${bin.fillLevel}%`, backgroundColor: bin.fillLevel >= 90 ? COLORS.danger : bin.color }]} />
              </View>
            </View>
          </View>
        ))}
      </View>
      <PrimaryButton title="Scan Unit to Unlock" icon="qr-code-outline" onPress={() => {}} />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  cardMargin: { marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  unitStatusBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  unitStatusText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  
  binsContainer: { marginBottom: 15 },
  binRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  binDetails: { flex: 1 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  typeStatusRow: { flexDirection: 'row', alignItems: 'center' },
  binType: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  binStatusText: { fontSize: 12, marginLeft: 6 },
  percent: { fontSize: 13, fontWeight: 'bold' },
  progressBg: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 },
  progressFill: { height: '100%', borderRadius: 3 },
});