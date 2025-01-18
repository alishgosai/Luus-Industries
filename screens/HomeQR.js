import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from '@react-navigation/native';
import {
  AppState,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductApi from '../Services/productApi';

export default function HomeQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setScanned(false);
        setIsScanning(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (data && isScanning) {
      setScanned(true);
      setIsScanning(false);

      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not authenticated');
        }
        ProductApi.setUserId(userId);

        const result = await ProductApi.getProductDetails(data, true);
        if (result.success) {
          const alertMessage = result.newlyRegistered
            ? 'This product has been registered to your account.'
            : 'Product scanned successfully.';

          Alert.alert(
            'Product Scanned',
            alertMessage,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('ProductDetails', { 
                  productId: data,
                  isNewProduct: result.newlyRegistered
                })
              }
            ]
          );
        } else {
          Alert.alert('Error', result.error || 'Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error handling scanned code:', error);
        Alert.alert('Error', 'Failed to process the scanned code. Please try again.');
      }
    }
  };

  const handleShutterPress = async () => {
    if (scanned) {
      setScanned(false);
      return;
    }

    if (cameraRef.current) {
      setIsScanning(true);
      // The camera will now scan for QR codes
    }
  };

  if (!isPermissionGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
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
              {scanned ? 'QR Code detected!' : isScanning ? 'Scanning...' : 'Press the button to scan a QR code'}
            </Text>
          </View>
        </View>
      </CameraView>
      <TouchableOpacity 
        style={styles.shutterButton}
        onPress={handleShutterPress}
      >
        <View style={styles.shutterButtonInner} />
      </TouchableOpacity>
    </SafeAreaView>
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
    bottom: 80,
    alignSelf: 'center',
  },
  shutterButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#87CEEB',
    opacity: 1,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

