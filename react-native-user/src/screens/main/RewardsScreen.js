import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import customFetch from '../../services/api';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../theme/colors';

export default function RewardsScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch personal rewards data
      const profileData = await customFetch('/users/me');
      setProfile(profileData);

      // Fetch zone leaderboard
      let zone = await SecureStore.getItemAsync('userZone');
      if (!zone) zone = profileData.zone;
      
      const leaderboardResponse = await customFetch(`/users/leaderboard?zone=${zone}`);
      setLeaderboard(leaderboardResponse.leaderboard);

    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load rewards data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userZone');
    navigation.replace('Auth');
  };

  // 2. The Personal Rewards Summary (Header)
  const renderRewardsHeader = () => {
    if (!profile) return null;
    
    return (
      <View style={styles.headerContainer}>
        {/* Top Banner */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Impact</Text>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.zone}>📍 {profile.zone}</Text>
        </View>

        {/* Rewards Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Green Points</Text>
            <Text style={styles.pointsHighlight}>{profile.green_points} pts</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.boldText}>🔥 {profile.streak} Days</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>CO2 Saved</Text>
            <Text style={styles.boldText}>🌱 {profile.co2_saved} kg</Text>
          </View>
        </View>

        <Text style={styles.leaderboardTitle}>🏆 Zone Leaderboard</Text>
      </View>
    );
  };

  // 3. The Footer (Log Out)
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <PrimaryButton title="Log Out" icon="log-out-outline" onPress={handleLogout} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={leaderboard}
        keyExtractor={(item) => item.username}
        ListHeaderComponent={renderRewardsHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[
            styles.card, 
            // Highlight the current user in the leaderboard!
            item.name === profile?.name && styles.currentUserCard 
          ]}>
            <Text style={styles.rank}>#{item.rank}</Text>
            <Text style={styles.leaderboardName}>{item.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  listContent: { paddingBottom: 30 },
  
  // Header Styles
  headerContainer: { paddingBottom: 10 },
  header: { alignItems: 'center', padding: 30, backgroundColor: COLORS.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 16, color: COLORS.white, opacity: 0.8, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 },
  profileName: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  zone: { fontSize: 16, color: COLORS.white, marginTop: 5, opacity: 0.9 },
  
  // Stats Card Styles
  statsCard: { margin: 20, marginTop: -20, backgroundColor: COLORS.white, borderRadius: 15, padding: 20, elevation: 5 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  statLabel: { fontSize: 16, color: COLORS.textSecondary },
  boldText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  pointsHighlight: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  
  // Leaderboard Styles
  leaderboardTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginVertical: 15 },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 20, marginHorizontal: 20, marginVertical: 6, borderRadius: 12, alignItems: 'center', elevation: 2 },
  currentUserCard: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: '#f0faea' }, 
  rank: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, width: 40 },
  leaderboardName: { flex: 1, fontSize: 18, color: COLORS.text, fontWeight: '500' },
  points: { fontSize: 16, fontWeight: 'bold', color: COLORS.textSecondary },
  
  // Footer Styles
  footerContainer: { paddingHorizontal: 20, marginTop: 30 }
});