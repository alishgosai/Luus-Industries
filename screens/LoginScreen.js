import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Login");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => handleTabSwitch("Login")}
          style={[
            styles.tab,
            activeTab === "Login" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Login" && styles.activeTabText,
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabSwitch("Register")}
          style={[
            styles.tab,
            activeTab === "Register" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Register" && styles.activeTabText,
            ]}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            {activeTab === "Login" ? "Login" : "Register"}
          </Text>
        </TouchableOpacity>

        {/* Footer Links */}
        {activeTab === "Login" && (
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Wave Section */}
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
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00bfff",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    width: width * 0.8,
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
    backgroundColor: "#111",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#00bfff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  linkText: {
    color: "#00bfff",
    fontSize: 14,
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
