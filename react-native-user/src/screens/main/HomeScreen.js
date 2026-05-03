import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import UnitCard from '../../components/specific/UnitCard';
import { COLORS } from '../../theme/colors';
import customFetch from '../../services/api'; 

export default function HomeScreen() {
  const [bins, setBins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialRegion = { latitude: 8.7274, longitude: 77.7136, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  useEffect(() => {
    fetchNearbyBins();
  }, []);

  const fetchNearbyBins = async () => {
    try {
      setIsLoading(true);
      const response = await customFetch(`/bins/nearby?lat=8.7274&lng=77.7136&radius=10.0`);
      setBins(response.results);
    } catch (error) {
      Alert.alert("Network Error", "Could not load nearby smart bins.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} initialRegion={initialRegion}>
            {!isLoading && bins.map(bin => (
              <Marker 
                key={bin.id} 
                coordinate={{ latitude: bin.latitude || 8.7274, longitude: bin.longitude || 77.7136 }} 
                title={bin.location} 
                description={`Status: ${bin.status} • ${bin.distance_km}km away`} 
                pinColor={bin.status === 'Active' ? COLORS.primary : 'red'} 
              />
            ))}
          </MapView>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.title}>Nearby Units</Text>
          <Text style={styles.subtitle}>Find a smart waste station near you</Text>
          <View style={{ marginTop: 20 }}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
              bins.map(bin => <UnitCard key={bin.id} unit={bin} />)
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  mapContainer: { height: 250, width: Dimensions.get('window').width },
  map: { flex: 1 },
  listContainer: { padding: 20, paddingTop: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 5 },
});