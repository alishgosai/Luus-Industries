import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AuthScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState("EnterEmail");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const renderForgotPassword = () => {
    if (forgotPasswordStep === "EnterEmail") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setForgotPasswordStep("VerifyCode")}
          >
            <Text style={styles.actionButtonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      );
    } else if (forgotPasswordStep === "VerifyCode") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setForgotPasswordStep("SetNewPassword")}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      );
    } else if (forgotPasswordStep === "SetNewPassword") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab("Login")}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Tabs */}
        {activeTab !== "ForgotPassword" && (
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => handleTabSwitch("Login")}
              style={[styles.tab, activeTab === "Login" && styles.activeTab]}
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
              style={[styles.tab, activeTab === "Register" && styles.activeTab]}
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
        )}

        {/* Form */}
        <View style={styles.formContainer}>
          {activeTab === "Login" && (
            <>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("Home")} // Navigate to Home on login
              >
                <Text style={styles.actionButtonText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.footerLinks}>
                <TouchableOpacity
                  onPress={() => setActiveTab("Register")}
                >
                  <Text style={styles.footerLink}>Create Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("ForgotPassword")}
                >
                  <Text style={styles.footerLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {activeTab === "Register" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
              />
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
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
              />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === "ForgotPassword" && renderForgotPassword()}
        </View>
      </ScrollView>

      {/* Wave Image */}
      <View style={styles.waveContainer}>
        <Image
          source={require("../assets/images/blue-wave.png")} // Replace with your wave image
          style={styles.waveImage}
          resizeMode="cover"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
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
  actionButton: {
    width: "100%",
    backgroundColor: "#00bfff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  footerLink: {
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
