import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>Camera permission denied, please enable it in settings.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonText}>Go back to Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.scanHereText}>Scan Here</Text>
      <Text style={styles.scanHereInstructions}>Please point the camera at the barcode.</Text>
      {scannedData ? (
        <View style={styles.scannedDataContainer}>
          <Text style={styles.scannedDataText}>{scannedData}</Text>
          {isValidURL(scannedData) && (
            <Image source={{ uri: scannedData }} style={styles.barcodeImage} />
          )}
        </View>
      ) : (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { padding: 16 },
  backButton: { padding: 8, backgroundColor: '#ddd', borderRadius: 4 },
  backButtonText: { color: '#333' },
  scanHereText: { fontSize: 20, margin: 16, textAlign: 'center' },
  scanHereInstructions: { fontSize: 16, margin: 8, textAlign: 'center' },
  scannerContainer: { flex: 1 },
  scannedDataContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  scannedDataText: { fontSize: 16, marginBottom: 8 },
  barcodeImage: { width: 200, height: 200, resizeMode: 'contain' },
});

export default ScannerScreen;
