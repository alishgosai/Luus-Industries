import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../backend/config/api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const EditPersonalDetailsScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "********",
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log('Fetching user details from:', `${API_URL}/user/user-profile/${userId}`);
      const response = await fetch(`${API_URL}/user/user-profile/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received user details:', JSON.stringify(data, null, 2));
      setUserDetails({
        name: data.name || "",
        dateOfBirth: data.accountInfo?.dateOfBirth ? moment(data.accountInfo.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY') : "",
        phoneNumber: data.accountInfo?.phoneNumber || "",
        email: data.accountInfo?.email || "",
        password: "********",
        avatar: data.avatar || null,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to load user details. Please check your internet connection and try again.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [fetchUserDetails])
  );

  const InfoItem = ({ icon, label, field, value, isPassword, keyboardType, isDateOfBirth }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const [showPassword, setShowPassword] = useState(false);

    const handleEdit = () => {
      if (!isDateOfBirth) {
        setUserDetails((prev) => ({
          ...prev,
          [field]: editedValue,
        }));
        setIsEditing(false);
        validateField(field, editedValue);
      } else {
        setActiveDateField(field);
        setDatePickerVisibility(true);
      }
    };

    const handlePress = () => {
      if (!isDateOfBirth) {
        setIsEditing(true);
      } else {
        setActiveDateField(field);
        setDatePickerVisibility(true);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <View>
        <TouchableOpacity style={styles.infoItem} onPress={handlePress}>
          <Icon name={icon} size={24} color="#87CEEB" style={styles.itemIcon} />
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{label}</Text>
            {isEditing ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.itemInput, isPassword && { flex: 1 }]}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  onBlur={handleEdit}
                  secureTextEntry={isPassword && !showPassword}
                  keyboardType={keyboardType}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleEdit}
                />
                {isPassword && (
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#87CEEB" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.itemValue}>{isPassword ? '********' : value}</Text>
            )}
          </View>
        </TouchableOpacity>
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveDateField(null);
  };

  const handleConfirm = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setUserDetails((prev) => ({
      ...prev,
      [activeDateField]: formattedDate,
    }));
    hideDatePicker();
    validateField(activeDateField, formattedDate);
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '';
      case 'phoneNumber':
        return !/^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(value) ? 'Invalid Australian phone number' : '';
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters long' : '';
      case 'dateOfBirth':
        return !moment(value, 'DD/MM/YYYY', true).isValid() ? 'Invalid date format' : '';
      default:
        return '';
    }
  };

  const handleSaveChanges = async () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(userDetails).forEach(key => {
      const error = validateField(key, userDetails[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      Alert.alert("Validation Error", "Please correct the errors before saving.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Sending user details:', JSON.stringify(userDetails, null, 2));
      const response = await fetch(`${API_URL}/user/update-details/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userDetails,
          dateOfBirth: moment(userDetails.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        }),
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Response status:', response.status);
        console.error('Response headers:', JSON.stringify(response.headers, null, 2));
        throw new Error(`Server responded with invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('User details updated successfully:', data);
      Alert.alert("Success", "Your details have been updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert("Error", `Failed to update details: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.container, { backgroundColor: "#121212" }]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Personal Details</Text>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.navigate("EditPicture")}
          >
            <Image
              source={userDetails.avatar ? { uri: userDetails.avatar } : require("../assets/images/person.png")}
              style={styles.avatar}
            />
            <View style={styles.editOverlay}>
              <Icon name="pencil" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <InfoItem
              icon="account"
              label="Name"
              field="name"
              value={userDetails.name}
              keyboardType="default"
            />
            <InfoItem
              icon="calendar"
              label="Date of Birth"
              field="dateOfBirth"
              value={userDetails.dateOfBirth}
              isDateOfBirth={true}
            />
            <InfoItem
              icon="phone"
              label="Phone Number"
              field="phoneNumber"
              value={userDetails.phoneNumber}
              keyboardType="phone-pad"
            />
            <InfoItem
              icon="email"
              label="Email"
              field="email"
              value={userDetails.email}
              keyboardType="email-address"
            />
            <InfoItem
              icon="lock"
              label="Password"
              field="password"
              value={userDetails.password}
              isPassword={true}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        date={userDetails.dateOfBirth ? moment(userDetails.dateOfBirth, 'DD/MM/YYYY').toDate() : new Date()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  avatarContainer: {
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editOverlay: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 0,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemIcon: {
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: "#87CEEB",
  },
  itemValue: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#87CEEB",
    paddingVertical: 4,
  },
  saveButton: {
    backgroundColor: "#87CEEB",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 39, // To align with the input text
  },
});

export default EditPersonalDetailsScreen;

