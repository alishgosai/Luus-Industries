import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ProductApi from '../Services/productApi';

export default function HomeQR() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleManualCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { format: 'jpeg', compress: 0.7 }
      );

      const base64Image = await FileSystem.readAsStringAsync(resizedPhoto.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Photo Captured', 'Processing the QR code...');

      const qrData = await ProductApi.detectQR(base64Image);

      if (qrData) {
        await handleBarCodeScanned({ data: qrData });
      } else {
        Alert.alert('No QR Code Found', 'The captured image does not contain a valid QR code.');
      }
    } catch (error) {
      const errorMessage = error.message || JSON.stringify(error);
      Alert.alert('Error', `Failed to capture and process the image: ${errorMessage}`);
      console.error('Error in handleManualCapture:', errorMessage);
    } finally {
      setIsProcessing(false);
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

