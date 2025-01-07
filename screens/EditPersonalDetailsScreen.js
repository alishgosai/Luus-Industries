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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { fetchUserProfile, updateUserDetails } from '../Services/userApi';

const EditPersonalDetailsScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: "",
    dateOfBirth: "",
    phoneNumber: "",
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const data = await fetchUserProfile();
      setUserDetails({
        name: data.name || "",
        dateOfBirth: data.accountInfo?.dateOfBirth ? moment(data.accountInfo.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY') : "",
        phoneNumber: data.accountInfo?.phoneNumber || "",
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

  const InfoItem = ({ icon, label, field, value, isDateOfBirth, keyboardType }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

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

    return (
      <View>
        <TouchableOpacity style={styles.infoItem} onPress={handlePress}>
          <Icon name={icon} size={24} color="#87CEEB" style={styles.itemIcon} />
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{label}</Text>
            {isEditing ? (
              <TextInput
                style={styles.itemInput}
                value={editedValue}
                onChangeText={setEditedValue}
                onBlur={handleEdit}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleEdit}
              />
            ) : (
              <Text style={styles.itemValue}>{value}</Text>
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
    let error = '';
    switch (field) {
      case 'phoneNumber':
        error = !/^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(value) ? 'Invalid Australian phone number' : '';
        break;
      case 'dateOfBirth':
        error = !moment(value, 'DD/MM/YYYY', true).isValid() ? 'Invalid date format' : '';
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
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
      const updatedDetails = {
        ...userDetails,
        dateOfBirth: moment(userDetails.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      };
      await updateUserDetails(updatedDetails);
      Alert.alert("Success", "Your details have been updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert("Error", `Failed to update details: ${error.message}`);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
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
          </View>

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <Icon name="lock" size={24} color="#87CEEB" style={styles.changePasswordIcon} />
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>

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
    marginBottom: 20,
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
  itemInput: {
    fontSize: 16,
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#87CEEB",
    paddingVertical: 4,
  },
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  changePasswordIcon: {
    marginRight: 10,
  },
  changePasswordButtonText: {
    color: "#87CEEB",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#87CEEB",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 39,
  },
});

export default EditPersonalDetailsScreen;

