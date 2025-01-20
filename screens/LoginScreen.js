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
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import { login, register, forgotPassword, resetPassword, verifyCode, logout } from "../Services/authApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function AuthScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState("EnterEmail");

  // Input states for Login
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Input states for Register
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerMobileNumber, setRegisterMobileNumber] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  // Date picker states
  const [registerDateOfBirth, setRegisterDateOfBirth] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Input states for Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});

  // Password visibility state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for TextInput components
  const identifierInput = useRef(null);
  const passwordInput = useRef(null);
  const nameInput = useRef(null);
  const mobileNumberInput = useRef(null);
  const registerEmailInput = useRef(null);
  const registerPasswordInput = useRef(null);
  const registerConfirmPasswordInput = useRef(null);
  const confirmNewPasswordInput = useRef(null);

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
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginIdentifier) {
      errors.identifier = "Email or Mobile Number is required";
    }
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    setLoginError(errors.identifier || errors.password);
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
    if (!registerDateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    } else if (!moment(registerDateOfBirth).isValid()) {
      errors.dateOfBirth = "Invalid date of birth";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidPhoneNumber = (phoneNumber) => {
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
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setRegisterDateOfBirth(date);
    hideDatePicker();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError('');

      if (!loginIdentifier?.trim() || !loginPassword?.trim()) {
        setLoginError('Please enter your email/phone and password');
        return;
      }

      const user = await login(loginIdentifier, loginPassword);
      
      if (user) {
        // Store login state
        await AsyncStorage.setItem('isLoggedIn', 'true');
        
        // Navigate to home screen
        navigation.replace('Home');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (validateRegister()) {
      try {
        const userData = {
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          dateOfBirth: moment(registerDateOfBirth).format('YYYY-MM-DD'),
          phoneNumber: registerMobileNumber
        };
        const user = await register(userData);
        Alert.alert("Success", "Your account has been created.");
        setActiveTab("Login");
        setRegisterErrors({});
      } catch (error) {
        Alert.alert('Registration Failed', error.message);
        setRegisterErrors({ general: error.message });
      }
    }
  };

  const handleLogout = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await logout({ userId });
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderForgotPassword = () => {
    if (forgotPasswordStep === "EnterEmail") {
      return (
        <>
          <Text style={styles.forgotPasswordTitle}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={forgotEmail}
            onChangeText={setForgotEmail}
            returnKeyType="done"
            onSubmitEditing={async () => {
              if (validateForgotEmail()) {
                try {
                  await forgotPassword(forgotEmail);
                  setForgotPasswordStep("VerifyCode");
                  setForgotErrors({});
                } catch (error) {
                  Alert.alert('Error', error.message);
                  setForgotErrors({ email: error.message });
                }
              }
            }}
          />
          {forgotErrors.email && (
            <Text style={styles.errorText}>{forgotErrors.email}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              if (validateForgotEmail()) {
                try {
                  await forgotPassword(forgotEmail);
                  setForgotPasswordStep("VerifyCode");
                  setForgotErrors({});
                } catch (error) {
                  Alert.alert('Error', error.message);
                  setForgotErrors({ email: error.message });
                }
              }
            }}
          >
            <Text style={styles.actionButtonText}>Send Code</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity onPress={() => setActiveTab("Login")}>
              <Text style={styles.footerLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (forgotPasswordStep === "VerifyCode") {
      return (
        <>
          <Text style={styles.forgotPasswordTitle}>Verify Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            value={forgotCode}
            onChangeText={setForgotCode}
            returnKeyType="done"
            onSubmitEditing={async () => {
              if (validateForgotCode()) {
                try {
                  await verifyCode(forgotEmail, forgotCode);
                  setForgotPasswordStep("SetNewPassword");
                  setForgotErrors({});
                } catch (error) {
                  Alert.alert('Error', error.message);
                  setForgotErrors({ code: error.message });
                }
              }
            }}
          />
          {forgotErrors.code && (
            <Text style={styles.errorText}>{forgotErrors.code}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              if (validateForgotCode()) {
                try {
                  await verifyCode(forgotEmail, forgotCode);
                  setForgotPasswordStep("SetNewPassword");
                  setForgotErrors({});
                } catch (error) {
                  Alert.alert('Error', error.message);
                  setForgotErrors({ code: error.message });
                }
              }
            }}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await forgotPassword(forgotEmail);
                  Alert.alert(
                    "Code Resent",
                    "A new code has been sent to your email."
                  );
                } catch (error) {
                  Alert.alert('Error', error.message);
                }
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
          <Text style={styles.forgotPasswordTitle}>Set New Password</Text>
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
          <View style={styles.passwordContainer}>
            <TextInput
              ref={confirmNewPasswordInput}
              style={styles.passwordInput}
              placeholder="Confirm New Password"
              placeholderTextColor="#888"
              secureTextEntry={!showConfirmPassword}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              returnKeyType="done"
              onSubmitEditing={async () => {
                if (validateNewPassword()) {
                  try {
                    await resetPassword(forgotEmail, forgotCode, newPassword);
                    Alert.alert(
                      "Success", 
                      "Password reset successful. Please login with your new password.",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            setActiveTab("Login");
                            // Clear all forgot password states
                            setForgotEmail("");
                            setForgotCode("");
                            setNewPassword("");
                            setConfirmNewPassword("");
                            setForgotErrors({});
                          }
                        }
                      ]
                    );
                  } catch (error) {
                    Alert.alert('Error', error.message);
                    if (error.message.includes('code')) {
                      setForgotPasswordStep("VerifyCode");
                    }
                    setForgotErrors({ general: error.message });
                  }
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="#888" />
            </TouchableOpacity>
          </View>
          {forgotErrors.confirmNewPassword && (
            <Text style={styles.errorText}>
              {forgotErrors.confirmNewPassword}
            </Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              if (validateNewPassword()) {
                try {
                  await resetPassword(forgotEmail, forgotCode, newPassword);
                  Alert.alert(
                    "Success", 
                    "Password reset successful. Please login with your new password.",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          setActiveTab("Login");
                          // Clear all forgot password states
                          setForgotEmail("");
                          setForgotCode("");
                          setNewPassword("");
                          setConfirmNewPassword("");
                          setForgotErrors({});
                        }
                      }
                    ]
                  );
                } catch (error) {
                  Alert.alert('Error', error.message);
                  if (error.message.includes('code')) {
                    setForgotPasswordStep("VerifyCode");
                  }
                  setForgotErrors({ general: error.message });
                }
              }
            }}
          >
            <Text style={styles.actionButtonText}>Reset Password</Text>
          </TouchableOpacity>
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
                    ref={identifierInput}
                    style={styles.input}
                    placeholder="Email or Mobile Number"
                    placeholderTextColor="#888"
                    keyboardType="default"
                    autoCapitalize="none"
                    value={loginIdentifier}
                    onChangeText={setLoginIdentifier}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInput.current.focus()}
                    blurOnSubmit={false}
                  />
                  {loginError && (
                    <Text style={styles.errorText}>{loginError}</Text>
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
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLogin}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>Login</Text>
                    )}
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
                    <Text style={[styles.datePickerText, !registerDateOfBirth && styles.placeholderText]}>
                      {registerDateOfBirth ? moment(registerDateOfBirth).format('DD/MM/YYYY') : 'Date of Birth'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={new Date()}
                    date={new Date()}
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
                  <View style={styles.passwordContainer}>
                    <TextInput
                      ref={registerConfirmPasswordInput}
                      style={styles.passwordInput}
                      placeholder="Confirm Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showConfirmPassword}
                      value={registerConfirmPassword}
                      onChangeText={setRegisterConfirmPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleRegister}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="#888" />
                    </TouchableOpacity>
                  </View>
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
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  forgotPasswordTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00bfff",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#111",
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
});
