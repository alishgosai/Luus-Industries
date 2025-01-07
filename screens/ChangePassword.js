import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { changePassword } from '../Services/userApi';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (!confirmNewPassword) newErrors.confirmNewPassword = 'Please confirm your new password';
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (validateForm()) {
      try {
        await changePassword(currentPassword, newPassword);
        Alert.alert('Success', 'Your password has been changed successfully.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const renderPasswordInput = (value, setValue, placeholder, showPassword, setShowPassword, error) => (
    <View style={styles.inputRow}>
      <Icon name="lock" size={24} color="#87CEEB" style={styles.inputIcon} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#87CEEB" />
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change password</Text>
      </View>

      <View style={styles.infoContainer}>
        {renderPasswordInput(
          currentPassword,
          setCurrentPassword,
          "Current password",
          showCurrentPassword,
          setShowCurrentPassword,
          errors.currentPassword
        )}
        {renderPasswordInput(
          newPassword,
          setNewPassword,
          "New password",
          showNewPassword,
          setShowNewPassword,
          errors.newPassword
        )}
        {renderPasswordInput(
          confirmNewPassword,
          setConfirmNewPassword,
          "Retype new password",
          showConfirmPassword,
          setShowConfirmPassword,
          errors.confirmNewPassword
        )}
      </View>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgotten your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.changePasswordButton} 
        onPress={handleChangePassword}
      >
        <Text style={styles.changePasswordButtonText}>Change Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#87CEEB",
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
  infoContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordButton: {
    marginTop: 16,
    marginHorizontal: 16,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    color: '#87CEEB',
    fontSize: 16,
  },
  changePasswordButton: {
    backgroundColor: '#87CEEB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    margin: 16,
  },
  changePasswordButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;

