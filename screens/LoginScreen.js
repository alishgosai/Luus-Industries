import React, { useState, useEffect } from "react";
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
  BackHandler,
  Alert,
  SafeAreaView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AuthScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState("EnterEmail");

  // Input states for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // Input states for Register
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  // Input states for Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});

  // Reset forgotPasswordStep when switching to ForgotPassword tab
  useEffect(() => {
    if (activeTab === "ForgotPassword") {
      setForgotPasswordStep("EnterEmail");
    }
  }, [activeTab]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (activeTab === "ForgotPassword") {
        if (forgotPasswordStep === "SetNewPassword") {
          setForgotPasswordStep("VerifyCode");
          return true; // Prevent default behavior
        } else if (forgotPasswordStep === "VerifyCode") {
          setForgotPasswordStep("EnterEmail");
          return true; // Prevent default behavior
        } else if (forgotPasswordStep === "EnterEmail") {
          setActiveTab("Login");
          return true; // Prevent default behavior
        }
      } else if (activeTab === "Register") {
        setActiveTab("Login");
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [activeTab, forgotPasswordStep]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  // Validation functions
  const validateEmail = (email) => {
    // Simple email regex for validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginEmail)) {
      errors.email = "Invalid email format";
    }
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerName) {
      errors.name = "Name is required";
    }
    if (!registerEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(registerEmail)) {
      errors.email = "Invalid email format";
    }
    if (!registerPassword) {
      errors.password = "Password is required";
    } else if (registerPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!registerConfirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerPassword !== registerConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotEmail = () => {
    const errors = {};
    if (!forgotEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(forgotEmail)) {
      errors.email = "Invalid email format";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotCode = () => {
    const errors = {};
    if (!forgotCode) {
      errors.code = "Code is required";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewPassword = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderForgotPassword = () => {
    if (forgotPasswordStep === "EnterEmail") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={forgotEmail}
            onChangeText={setForgotEmail}
          />
          {forgotErrors.email && (
            <Text style={styles.errorText}>{forgotErrors.email}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotEmail()) {
                // Implement actual send code logic here
                // For demonstration, we'll just proceed to the next step
                setForgotPasswordStep("VerifyCode");
                setForgotErrors({});
              }
            }}
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
            keyboardType="number-pad"
            value={forgotCode}
            onChangeText={setForgotCode}
          />
          {forgotErrors.code && (
            <Text style={styles.errorText}>{forgotErrors.code}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotCode()) {
                // Implement actual verify code logic here
                // For demonstration, we'll just proceed to the next step
                setForgotPasswordStep("SetNewPassword");
                setForgotErrors({});
              }
            }}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity
              onPress={() => {
                // Implement resend code logic here
                Alert.alert(
                  "Code Resent",
                  "A new code has been sent to your email."
                );
                // Optionally, you can reset to EnterEmail step if desired
                // setForgotPasswordStep("EnterEmail");
              }}
            >
              <Text style={styles.footerLink}>Send Code Again</Text>
            </TouchableOpacity>
          </View>
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
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {forgotErrors.newPassword && (
            <Text style={styles.errorText}>{forgotErrors.newPassword}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          {forgotErrors.confirmNewPassword && (
            <Text style={styles.errorText}>
              {forgotErrors.confirmNewPassword}
            </Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateNewPassword()) {
                // Implement actual password reset logic here
                Alert.alert("Success", "Your password has been reset.");
                setActiveTab("Login");
                setForgotErrors({});
              }
            }}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity
              onPress={() => {
                setActiveTab("Login");
              }}
            >
              <Text style={styles.footerLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Wave Image */}
        <View style={styles.waveContainer}>
          <Image
            source={require("../assets/images/blue-wave.png")} // Replace with your wave image
            style={styles.waveImage}
            resizeMode="cover"
          />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
            )}

            {/* Form */}
            <View style={styles.formContainer}>
              {activeTab === "Login" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                  />
                  {loginErrors.email && (
                    <Text style={styles.errorText}>{loginErrors.email}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  {loginErrors.password && (
                    <Text style={styles.errorText}>{loginErrors.password}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      if (validateLogin()) {
                        // Implement actual login logic here
                        navigation.navigate("Home"); // Navigate to Home on login
                        setLoginErrors({});
                      }
                    }}
                  >
                    <Text style={styles.actionButtonText}>Login</Text>
                  </TouchableOpacity>
                  <View style={styles.footerLinks}>
                    <TouchableOpacity
                      onPress={() => handleTabSwitch("Register")}
                    >
                      <Text style={styles.footerLink}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleTabSwitch("ForgotPassword")}
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
                    autoCapitalize="words"
                    value={registerName}
                    onChangeText={setRegisterName}
                  />
                  {registerErrors.name && (
                    <Text style={styles.errorText}>{registerErrors.name}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                  />
                  {registerErrors.email && (
                    <Text style={styles.errorText}>{registerErrors.email}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                  />
                  {registerErrors.password && (
                    <Text style={styles.errorText}>
                      {registerErrors.password}
                    </Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                  />
                  {registerErrors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {registerErrors.confirmPassword}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      if (validateRegister()) {
                        // Implement actual registration logic here
                        Alert.alert("Success", "Your account has been created.");
                        setActiveTab("Login");
                        setRegisterErrors({});
                      }
                    }}
                  >
                    <Text style={styles.actionButtonText}>Sign Up</Text>
                  </TouchableOpacity>
                  <View style={styles.registerFooterLinks}>
                    <Text style={styles.footerText}>
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => handleTabSwitch("Login")}>
                      <Text style={styles.footerLink}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {activeTab === "ForgotPassword" && renderForgotPassword()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingBottom: width * 0.3 + 20, // Ensure content is above the wave
  },
  logo: {
    width: width * 0.5,
    height: width * 0.2,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15, // Increased spacing
    backgroundColor: "#111",
  },
  errorText: {
    width: "100%",
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  actionButton: {
    width: "100%",
    backgroundColor: "#00bfff",
    paddingVertical: 14,
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
  registerFooterLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  forgotFooterLinks: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: width * 0.3,
  },
  waveImage: {
    width: "100%",
    height: "100%",
  },
});
