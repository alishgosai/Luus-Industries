import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ScanOrLoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")} // Replace with your logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("Scan")} // Navigate to ScanScreen
      >
        <Ionicons name="scan-outline" size={40} color="#00bfff" />
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      {/* Scan Products Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Scan")} // Navigate to ScanScreen
      >
        <Text style={styles.primaryButtonText}>Scan Products</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <Text style={styles.orText}>OR</Text>

      {/* Log In Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Login")} // Navigate to Login Screen
      >
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Create Account Link */}
      <Text style={styles.footerText}>
        New User?{" "}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate("Register")} // Navigate to Register Screen
        >
          Create Account
        </Text>
      </Text>

      {/* Wave Image */}
      <View style={styles.waveContainer}>
        <Image
          source={require("../assets/images/blue-wave.png")} // Replace with your wave image
          style={styles.waveImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.2,
    marginBottom: 40,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#00bfff",
  },
  scanButtonText: {
    color: "#00bfff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  primaryButton: {
    width: "80%",
    backgroundColor: "#00bfff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 15,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 20,
  },
  footerLink: {
    color: "#00bfff",
    fontWeight: "600",
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  waveImage: {
    width: "100%",
    height: width * 0.3,
  },
});
