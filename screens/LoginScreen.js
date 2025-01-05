import React, { useState, useEffect, useRef } from "react";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import API_URL from "../backend/config/api";
import { auth } from '../FireBase/firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [registerMobileNumber, setRegisterMobileNumber] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  // Date picker states
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [registerDateOfBirth, setRegisterDateOfBirth] = useState(new Date());

  // Input states for Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});

  // Refs for TextInput components
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const nameInput = useRef(null);
  const mobileNumberInput = useRef(null);
  const registerEmailInput = useRef(null);
  const registerPasswordInput = useRef(null);
  const registerConfirmPasswordInput = useRef(null);

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
    if (!registerMobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!isValidPhoneNumber(registerMobileNumber)) {
      errors.mobileNumber = "Invalid mobile number format. Please enter a valid Australian mobile number (e.g., 0412345678)";
    }
    if (!moment(registerDateOfBirth).isValid()) {
      errors.dateOfBirth = "Invalid date of birth";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    // Australian mobile number format (starting with '04' and 10 digits long)
    const australianMobileRegex = /^04\d{8}$/;
    return australianMobileRegex.test(phoneNumber);
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setRegisterDateOfBirth(date);
    hideDatePicker();
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        // Firebase authentication
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        
        // Backend authentication
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: loginEmail,
          password: loginPassword
        });
        
        const { userId, user } = response.data;
        
        if (userId) {
          // Store user ID in AsyncStorage
          await AsyncStorage.setItem('userId', userId);
          
          // Store user data in AsyncStorage
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          
          // Navigate to Home screen
          navigation.navigate("Home");
          setLoginErrors({});
        } else {
          throw new Error('User ID not received from server');
        }
      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'An unexpected error occurred. Please try again.';
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.code) {
          switch (error.code) {
            case 'auth/invalid-credential':
              errorMessage = 'Invalid email or password. Please check your credentials and try again.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'No user found with this email. Please check your email or sign up.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Network error. Please check your internet connection and try again.';
              break;
          }
        }
        
        Alert.alert('Login Failed', errorMessage);
        setLoginErrors({ general: errorMessage });
      }
    }
  };
  
  
  
  const handleRegister = async () => {
    if (validateRegister()) {
      try {
        // Backend registration
        const response = await axios.post(`${API_URL}/auth/register`, {
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          dateOfBirth: moment(registerDateOfBirth).format('YYYY-MM-DD'),
          phoneNumber: registerMobileNumber
        });
        
        const { user } = response.data;
        
        // Store user data in AsyncStorage
        if (user && user.id) {
          await AsyncStorage.setItem('userId', user.id);
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          
          Alert.alert("Success", "Your account has been created.");
          setActiveTab("Login");
          setRegisterErrors({});
        } else {
          throw new Error('Incomplete user data received from server');
        }
      } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'An unexpected error occurred during registration. Please try again.';
        
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
        
        // Handle specific Firebase Auth errors
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already in use. Please use a different email or try logging in.';
        }
        
        Alert.alert('Registration Failed', errorMessage);
        setRegisterErrors({ general: errorMessage });
      }
    }
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
            returnKeyType="done"
            onSubmitEditing={() => {
              if (validateForgotEmail()) {
                setForgotPasswordStep("VerifyCode");
                setForgotErrors({});
              }
            }}
          />
          {forgotErrors.email && (
            <Text style={styles.errorText}>{forgotErrors.email}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotEmail()) {
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
            returnKeyType="done"
            onSubmitEditing={() => {
              if (validateForgotCode()) {
                setForgotPasswordStep("SetNewPassword");
                setForgotErrors({});
              }
            }}
          />
          {forgotErrors.code && (
            <Text style={styles.errorText}>{forgotErrors.code}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotCode()) {
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
                Alert.alert(
                  "Code Resent",
                  "A new code has been sent to your email."
                );
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
            returnKeyType="next"
            onSubmitEditing={() => confirmNewPasswordInput.current.focus()}
          />
          {forgotErrors.newPassword && (
            <Text style={styles.errorText}>{forgotErrors.newPassword}</Text>
          )}
          <TextInput
            ref={confirmNewPasswordInput}
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (validateNewPassword()) {
                Alert.alert("Success", "Your password has been reset.");
                setActiveTab("Login");
                setForgotErrors({});
              }
            }}
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
            source={require("../assets/images/blue-wave.png")}
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
              source={require("../assets/images/logo.png")}
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
                    activeTab=== "Register" && styles.activeTab,
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
                    ref={emailInput}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  {loginErrors.email && (
                    <Text style={styles.errorText}>{loginErrors.email}</Text>
                  )}
                  <TextInput
                    ref={passwordInput}
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  {loginErrors.password && (
                    <Text style={styles.errorText}>{loginErrors.password}</Text>
                  )}
                  {loginErrors.general && (
                    <Text style={styles.errorText}>{loginErrors.general}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLogin}
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
                    ref={nameInput}
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    autoCapitalize="words"
                    value={registerName}
                    onChangeText={setRegisterName}
                    returnKeyType="next"
                    onSubmitEditing={() => registerEmailInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  {registerErrors.name && (
                    <Text style={styles.errorText}>{registerErrors.name}</Text>
                  )}
                  <TextInput
                    ref={registerEmailInput}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    returnKeyType="next"
                    onSubmitEditing={() => mobileNumberInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  {registerErrors.email && (
                    <Text style={styles.errorText}>{registerErrors.email}</Text>
                  )}
                  <TextInput
                    ref={mobileNumberInput}
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    value={registerMobileNumber}
                    onChangeText={setRegisterMobileNumber}
                    returnKeyType="next"
                    onSubmitEditing={showDatePicker}
                    blurOnSubmit={false}
                  />
                  {registerErrors.mobileNumber && (
                    <Text style={styles.errorText}>{registerErrors.mobileNumber}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.input}
                    onPress={showDatePicker}
                  >
                    <Text style={styles.datePickerText}>
                      {moment(registerDateOfBirth).format('DD/MM/YYYY')}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={new Date()}
                  />
                  {registerErrors.dateOfBirth && (
                    <Text style={styles.errorText}>{registerErrors.dateOfBirth}</Text>
                  )}
                  <TextInput
                    ref={registerPasswordInput}
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    returnKeyType="next"
                    onSubmitEditing={() => registerConfirmPasswordInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  {registerErrors.password && (
                    <Text style={styles.errorText}>
                      {registerErrors.password}
                    </Text>
                  )}
                  <TextInput
                    ref={registerConfirmPasswordInput}
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                  {registerErrors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {registerErrors.confirmPassword}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleRegister}
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
    marginBottom: 15,
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
  datePickerText: {
    color: '#fff',
    fontSize: 16,
  },
});
