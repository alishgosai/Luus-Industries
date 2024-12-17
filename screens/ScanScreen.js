import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Feather';

const QRScanner = () => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannedData, setScannedData] = useState('');

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    // Handle the scanned data as needed
    console.log('Scanned data:', data);
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        style={styles.cameraView}
        type={RNCamera.Constants.Type.back}
        flashMode={isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        onBarCodeRead={handleBarCodeScanned}
        captureAudio={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {/* Handle back navigation */}}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Amazon lens</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
              <Icon name="zap" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="help-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlButton}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🔍</Text>
            </View>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, styles.activeButton]}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <Text style={[styles.buttonText, styles.activeText]}>Barcode</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  scanFrame: {
    flex: 1,
    margin: 50,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
    width: 20,
    height: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
    width: 20,
    height: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
    width: 20,
    height: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
    width: 20,
    height: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  controlButton: {
    alignItems: 'center',
    opacity: 0.6,
  },
  activeButton: {
    opacity: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  buttonText: {
    color: '#666',
    fontSize: 14,
  },
  activeText: {
    color: '#000',
    fontWeight: '500',
  },
});

export default QRScanner;

