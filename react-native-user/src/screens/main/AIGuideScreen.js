import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../../components/common/PrimaryButton';
import customFetch from '../../services/api';
import { COLORS } from '../../theme/colors';

export default function AIGuideScreen() {
  const [photo, setPhoto] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'PowerNest needs camera access to sort waste.');
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Force square aspect to match AI training (224x224)
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setResult(null); // Clear previous result
    }
  };

  const uploadWaste = async () => {
    if (!photo) return;
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('file', {
      uri: photo,
      name: 'waste_analysis.jpg',
      type: 'image/jpeg',
    });

    try {
      // Endpoint matches your FastAPI bins router
      const response = await customFetch('/bins/U-102/dispose', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.status === 'success') {
        setResult(response);
        Alert.alert(
          'Waste Processed!',
          `Category: ${response.ai_classification.category}\nPoints: +${response.points_awarded}`
        );
      }
    } catch (error) {
      console.error("AI Upload Error:", error);
      Alert.alert('Analysis Error', 'Could not connect to PowerNest AI. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setPhoto(null);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PowerNest AI</Text>
      
      <View style={styles.imageBox}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.capturedImage} />
        ) : (
          <Text style={styles.placeholder}>Capture waste to classify</Text>
        )}
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>Category: {result.ai_classification.category}</Text>
          <Text style={styles.pointsText}>+{result.points_awarded} Green Points</Text>
        </View>
      )}

      {isAnalyzing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>AI is analyzing materials...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {!photo || result ? (
            <PrimaryButton title="Take Photo" icon="camera" onPress={takePhoto} />
          ) : (
            <>
              <PrimaryButton title="Analyze & Dispose" icon="cloud-upload" onPress={uploadWaste} />
              <Text style={styles.retryText} onPress={resetScanner}>Retake Photo</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: 40 },
  imageBox: { width: 280, height: 280, backgroundColor: COLORS.white, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  capturedImage: { width: 280, height: 280, borderRadius: 25 },
  placeholder: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center', padding: 20 },
  resultCard: { backgroundColor: '#e8f5e9', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#c8e6c9' },
  resultText: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  pointsText: { fontSize: 16, color: '#388e3c', marginTop: 5 },
  loadingContainer: { alignItems: 'center', marginTop: 20 },
  loadingText: { marginTop: 10, color: COLORS.textSecondary, fontStyle: 'italic' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  retryText: { marginTop: 15, color: COLORS.error, fontWeight: '600', textDecorationLine: 'underline' }
});