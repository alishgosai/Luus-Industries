import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Vibration, Alert } from 'react-native';
import axios from 'axios';
import API_URL from '../backend/config/api';

export default function HomeQR() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            console.log('Requesting camera permission');
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            console.log('Camera permission status:', status);
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        if (scanned || loading) {
            console.log('Scan blocked: Already processing a code');
            return;
        }

        console.log('QR Code detected!');
        console.log('Type:', type);
        console.log('Data:', data);

        setScanned(true);
        setLoading(true);
        Vibration.vibrate();

        try {
            const endpoint = `${API_URL}/api/warranty-products`;
            console.log('Sending QR data to endpoint:', endpoint);
            
            const requestData = { qrData: data };
            console.log('Request payload:', requestData);

            const response = await axios.post(endpoint, requestData);
            console.log('Backend response received:', response.data);

            if (response.data) {
                console.log('QR code processed successfully');
                Alert.alert('Success', `Product found: ${response.data.name}`);
                navigation.navigate('ProductDetails', { productData: response.data });
            } else {
                console.log('QR code processing failed: Product not found');
                Alert.alert('Error', 'Product not found. Please try again.');
            }
        } catch (error) {
            console.error('Error in QR code processing:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data
            });
            if (error.response) {
                console.log('Error response:', error.response.data);
                console.log('Error status:', error.response.status);
            } else if (error.request) {
                console.log('Error request:', error.request);
            }
            Alert.alert('Error', 'An error occurred while processing the QR code. Please try again.');
        } finally {
            console.log('Resetting scan state');
            setLoading(false);
            setScanned(false);
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
           <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barCodeScannerSettings={{
                    barCodeTypes: [Camera.Constants.BarCodeType.qr],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.unfocusedContainer}/>
                    <View style={styles.middleContainer}>
                        <View style={styles.unfocusedContainer}/>
                        <View style={styles.focusedContainer}>
                            <View style={[styles.scanFrame, scanned && styles.scanFrameSuccess]}>
                            </View>
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.shutterButton} 
                    onPress={() => {
                        console.log('Reset scan button pressed');
                        setScanned(false);
                    }}
                    disabled={loading}
                >
                    <View style={styles.shutterButtonInner} />
                </TouchableOpacity>
            </View>
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
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
    },
    successText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        padding: 8,
        borderRadius: 4,
    },
    scanInstructions: {
        textAlign: 'center',
        width: '100%',
        position: 'absolute',
        top: 40,
        fontSize: 16,
        color: 'white',
    },
    buttonContainer: {
        position: 'absolute',
        padding: 2,
        bottom: 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    scanAgainButton: {
        backgroundColor: '87CEEB',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    shutterButton: {
        width: 70,
        height: 70,
        margin: 90,
        borderRadius: 35,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: '#87CEEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterButtonInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#87CEEB',
        opacity: 1,
    },
    text: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#87CEEB',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});

