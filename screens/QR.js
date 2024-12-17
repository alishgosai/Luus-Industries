import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QRCodeScanner = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('Requesting camera permission...');
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setCameraError('Failed to request camera permission');
      }
    })();

    console.log('Camera module:', Camera);
    console.log('Camera.Constants:', Camera.Constants);
    console.log('Camera.Constants?.Type:', Camera.Constants?.Type);
  }, []);

  const handleQRCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsCameraOpen(false);
    Alert.alert("QR Code Scanned", `QR code with data: ${data} has been scanned!`);
  };

  const handleOpenCamera = () => {
    console.log('Opening camera...');
    console.log('hasPermission:', hasPermission);
    if (hasPermission) {
      setIsCameraOpen(true);
      setScanned(false);
    } else {
      Alert.alert("Camera Permission", "Please grant camera permission to scan QR codes.");
    }
  };

  const handleCloseCamera = () => {
    console.log('Closing camera...');
    setIsCameraOpen(false);
  };

  if (hasPermission === null) {
    return <View><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.text}>No access to camera</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
        </View>

        {isCameraOpen ? (
          <View style={styles.cameraContainer}>
            {Camera.Constants && Camera.Constants.Type ? (
              <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
                barCodeScannerSettings={{
                  barCodeTypes: ['qr'],
                }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.scanText}>Align QR code within the frame</Text>
                  <View style={styles.scanFrame} />
                </View>
              </Camera>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {cameraError || 'Camera is not available'}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseCamera}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.openCameraButton}
              onPress={handleOpenCamera}
            >
              <Icon name="qrcode-scan" size={48} color="#87CEEB" />
              <Text style={styles.openCameraText}>Tap to Scan QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    margin: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#87CEEB',
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  openCameraButton: {
    alignItems: 'center',
  },
  openCameraText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRCodeScanner;

