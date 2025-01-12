import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductApi from '../Services/productApi';

export default function HomeQR() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      console.log('Requesting camera permission...');
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');

      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Retrieved user ID:', storedUserId);
      if (storedUserId) {
        setUserId(storedUserId);
        ProductApi.setUserId(storedUserId);
      } else {
        console.log('User not authenticated, redirecting to login');
        navigation.replace('Login');
      }
    })();
  }, [navigation]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    console.log('Scanned QR code:', data);
    processScannedData(data);
  };

  const handleManualCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        console.log('Picture taken:', photo.uri);
        
        // Here you would process the photo for QR code
        // For now, we'll simulate finding a QR code
        const simulatedQrData = "PROD_WV1A";
        await processScannedData(simulatedQrData);
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const processScannedData = async (qrCodeData) => {
    console.log('Processing scanned data:', qrCodeData);
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Calling scanAndRegisterProduct with user ID:', userId);
      const result = await ProductApi.scanAndRegisterProduct(qrCodeData);
      console.log('scanAndRegisterProduct result:', result);

      if (result.success) {
        console.log('Product registration successful');
        const message = result.isNewProduct
          ? 'New product created and registered to your account!'
          : 'Product registered to your account!';
        Alert.alert('Success', message);
        navigation.navigate('ProductDetails', { 
          productId: result.productId,
          isNewProduct: result.isNewProduct
        });
      } else {
        console.log('Product registration failed:', result.error);
        Alert.alert('Error', result.error || 'Failed to register product. Please try again.');
      }
    } catch (error) {
      console.error('Error processing product data:', error);
      Alert.alert('Error', 'Unable to register product. Please try again.');
    } finally {
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type="back"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
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
              {scanned ? 'QR Code detected!' : 'Position a QR code inside the frame to scan'}
            </Text>
          </View>
        </View>
      </CameraView>
      <TouchableOpacity style={styles.shutterButton} onPress={handleManualCapture}>
        <View style={styles.shutterButtonInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
  },
  shutterButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#87CEEB',
    opacity: 1,
  }
});

