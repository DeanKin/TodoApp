import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { useNavigation } from '@react-navigation/native';

interface CurrencyResult {
  isAuthentic: boolean;
  confidence: number;
  currencyType: string;
  serialNumber?: string;
}

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<CurrencyResult | null>(null);
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const analyzeCurrency = async (image: string): Promise<CurrencyResult> => {
    try {
      // Resize image for better processing
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Perform text recognition
      const result = await TextRecognition.recognize(manipulatedImage.uri);

      // Simple currency verification logic (this should be enhanced with more sophisticated checks)
      const detectedText = result.text.toLowerCase();
      
      // Example verification patterns (should be expanded based on currency types)
      const patterns = {
        hkd: /hong\s*kong|HONG\s*KONG|HKD|港幣/,
        usd: /federal\s*reserve|USD|DOLLARS/,
        eur: /euro|EURO|EUR|€/,
        // Add more currency patterns
      };

      let currencyType = 'unknown';
      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(detectedText)) {
          currencyType = type.toUpperCase();
          break;
        }
      }

      // Serial number detection (example pattern, should be adjusted per currency)
      const serialPattern = /[A-Z]{2}\d{6,}/;
      const serialNumber = detectedText.match(serialPattern)?.[0];

      // Calculate confidence based on various factors
      let confidence = 0;
      confidence += currencyType !== 'unknown' ? 0.4 : 0;
      confidence += serialNumber ? 0.3 : 0;
      confidence += result.blocks.length > 3 ? 0.3 : 0; // Expecting multiple text blocks

      return {
        isAuthentic: confidence > 0.7,
        confidence: confidence * 100,
        currencyType,
        serialNumber,
      };
    } catch (error) {
      console.error('Currency analysis error:', error);
      throw new Error('Failed to analyze currency');
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      const result = await analyzeCurrency(photo.uri);
      setLastResult(result);

      // Show result alert
      Alert.alert(
        'Verification Result',
        `Currency Type: ${result.currencyType}\n` +
        `Authenticity: ${result.isAuthentic ? 'Authentic' : 'Suspicious'}\n` +
        `Confidence: ${result.confidence.toFixed(1)}%\n` +
        (result.serialNumber ? `Serial Number: ${result.serialNumber}` : ''),
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze currency. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator /></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
      >
        <View style={styles.overlay}>
          <View style={styles.guideBox}>
            {/* Currency guide frame */}
          </View>
        </View>
      </Camera>

      <View style={styles.controls}>
        {lastResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Last Scan: {lastResult.currencyType}
              {'\n'}
              Confidence: {lastResult.confidence.toFixed(1)}%
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={takePicture}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Analyzing...' : 'Verify Currency'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: 300,
    height: 150,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CameraScreen; 