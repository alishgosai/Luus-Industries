import React, { useState } from 'react';
import { CameraView, useCameraPermissions, BarCodeScanner } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Vibration } from 'react-native';



export default function QRScanner() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    if (!permission) {
        return <View />;
    }
    
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => 
            current === CameraView.Constants.Type.back
                ? CameraView.Constants.Type.front
                : CameraView.Constants.Type.back
        );
    };


    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return; // Prevent multiple scans
        setScanned(true);
        Vibration.vibrate(); // Add haptic feedback
        alert(`QR Code Scanned!\n\nData: ${data}`);
    };

    return (
        <View style={styles.container}>
           <CameraView
                style={styles.camera}
                type={facing}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barCodeTypes: ['QR'],
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
                            {scanned ? 'QR Code detected!' : 'Position a QR code inside the frame to scan'}
                        </Text>
                        
                    </View>
                </View>


            </CameraView>
            <View style={styles.buttonContainer}>
                
<TouchableOpacity style={styles.shutterButton} onPress={()  => navigation.navigate('BeforeProductDetails')}
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
        borderColor: '#4CAF50', // Green color for success
        borderWidth: 3,
    },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(76, 175, 80, 0.3)', // Semi-transparent green
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28, // To match the scanFrame borderRadius
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
        padding:2,
        bottom: 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    scanAgainButton: {
        backgroundColor: '87CEEB', // Semi-transparent green
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
});

