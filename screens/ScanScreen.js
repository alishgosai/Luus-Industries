import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert("Barcode Scanned", `Data: ${data}`, [
      { text: "OK", onPress: () => setScanned(false) },
    ]);
    // Add further logic here (e.g., navigate or process data)
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          No access to camera. Please enable it in settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Go back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Preview */}
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [
            Camera.Constants.BarCodeType.ean13,
            Camera.Constants.BarCodeType.qr,
          ],
        }}
      >
        {/* Scan Overlay */}
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>Scan Here</Text>
          <Text style={styles.scanInstruction}>
            Please point the camera at the barcode.
          </Text>
          <View style={styles.scanBox}></View>
        </View>
      </Camera>

      {/* Capture Button */}
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => setScanned(false)} // Reset scanning
        ></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0078D7",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  scanOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scanInstruction: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  scanBox: {
    width: width * 0.8,
    height: width * 0.5,
    borderWidth: 2,
    borderColor: "#00bfff",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  captureButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00bfff",
    borderWidth: 4,
    borderColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
  },
});
