import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

export default function QRScanner() {
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(true);

  const onBarCodeRead = (scanResult) => {
    if (scanning) {
      setScanning(false);
      try {
        const productId = scanResult.data; // Extracting product ID from QR code data
        navigation.navigate('ProductInfo', { productId }); // Navigate to ProductInfo screen with productId
      } catch (error) {
        Alert.alert('Error', 'Invalid QR Code');
        setScanning(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.headerText}>Go back to Login</Text>
      </TouchableOpacity>

      <View style={styles.cameraContainer}>
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.scanTitle}>Scan Here</Text>
            <Text style={styles.scanInstructions}>
              Please point the camera at the barcode
            </Text>
            <View style={styles.scanIndicator} />
          </View>
        </RNCamera>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#87CEEB',
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  scanIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
    borderWidth: 2,
    borderColor: '#87CEEB',
  },
});
