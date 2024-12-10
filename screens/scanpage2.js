import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera"; // Camera functionality for barcode scanning
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

// Barcode Scanner Screen
const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Camera
      style={styles.camera}
      onBarCodeScanned={({ data }) => navigation.navigate("ProductInfo", { barcodeData: data })}
    >
      <View style={styles.cameraOverlay}>
        <Text style={styles.scanText}>Scan Here</Text>
        <View style={styles.scanBox} />
      </View>
    </Camera>
  );
};

// Product Info Screen
const ProductInfoScreen = ({ route, navigation }) => {
  const { barcodeData } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Product Information</Text>
      <Image
        source={{ uri: "https://via.placeholder.com/200" }} // Replace with actual image URL
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>RS 600MM Oven</Text>
      <Text style={styles.productDetails}>
        Compact 600mm wide oven range with burner configurations available. {"\n"}
        Dimensions: 600w x 800d x 1100h. {"\n"} Cleaning: Dishwasher safe.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EnquiryForm")}
      >
        <Text style={styles.buttonText}>Enquire Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Enquiry Form Screen
const EnquiryFormScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Enquiry Form</Text>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Business Name" />
      <TextInput style={styles.input} placeholder="Location" />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Message"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.fileButton}>
        <Text style={styles.buttonText}>Attach File</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Main App Component with Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
        <Stack.Screen name="EnquiryForm" component={EnquiryFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  scanBox: {
    width: 200,
    height: 200,
    borderColor: "blue",
    borderWidth: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productDetails: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  fileButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
