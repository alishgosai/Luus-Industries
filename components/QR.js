import React from 'react';
import { Camera } from 'expo-camera';
import { View, Text, StyleSheet } from 'react-native';

export const QRCamera = ({ onBarCodeScanned, scanned, loading }) => {
    const cameraType = Camera.Constants?.Type?.back || 'back';
    return (
      <Camera
        style={styles.camera}
        type={cameraType}
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}/>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}/>
            <View style={styles.focusedContainer}>
              <View style={[styles.scanFrame, scanned && styles.scanFrameSuccess]} />
            </View>
            <View style={styles.unfocusedContainer}/>
          </View>
          <View style={styles.unfocusedContainer}>
            <Text style={styles.scanInstructions}>
              {loading ? 'Processing QR code...' : (scanned ? 'QR Code detected!' : 'Position a QR code inside the frame to scan')}
            </Text>
          </View>
        </View>
      </Camera>
    );
  };
  
  const styles = StyleSheet.create({
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    unfocusedContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    middleContainer: {
      flexDirection: 'row',
      flex: 1.5,
    },
    focusedContainer: {
      flex: 6,
    },
    scanFrame: {
      flex: 1,
      borderWidth: 2,
      borderColor: '#fff',
      backgroundColor: 'transparent',
      borderRadius: 2,
    },
    scanFrameSuccess: {
      borderColor: '#4CAF50',
      borderWidth: 3,
    },
    scanInstructions: {
      textAlign: 'center',
      width: '100%',
      position: 'absolute',
      top: 40,
      fontSize: 16,
      color: 'white',
    },
  });
  
  
