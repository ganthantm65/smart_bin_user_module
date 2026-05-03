import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import customFetch from '../../services/api';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!citizenId || !password) {
      setErrorMsg('Please enter both Citizen ID and Password');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const responseData = await customFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: citizenId, password: password }),
      });

      await SecureStore.setItemAsync('userToken', responseData.token);
      await SecureStore.setItemAsync('userZone', responseData.zone);

      navigation.replace('Main'); 
    } catch (error) {
      setErrorMsg(error.message || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Ionicons name="leaf" size={60} color={COLORS.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Bin Tech</Text>
      <Text style={styles.subtitle}>Smart Waste Ecosystem</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} placeholder="Citizen ID" value={citizenId} 
            onChangeText={setCitizenId} autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} placeholder="Password" value={password} 
            onChangeText={setPassword} secureTextEntry
          />
        </View>

        {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}
        <View style={styles.spacer} />
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <PrimaryButton title="Secure Login" icon="lock-closed" onPress={handleLogin} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 40 },
  formContainer: { width: '100%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 15, marginBottom: 15, paddingHorizontal: 15, height: 60, elevation: 2 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: COLORS.text },
  errorText: { color: COLORS.danger, textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
  spacer: { height: 20 }
});