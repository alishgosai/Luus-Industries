import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditPersonalDetailsScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: "Luus User",
    dob: "21/09/2000",
    phone: "941234567",
    email: "luususer@luxe.com",
    password: "********"
  });

  const InfoItem = ({ icon, label, field, value, isPassword }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    const handleEdit = () => {
      setUserDetails(prev => ({
        ...prev,
        [field]: editedValue
      }));
      setIsEditing(false);
    };

    return (
      <View style={styles.infoItem}>
        <Icon name={icon} size={24} color="#87CEEB" style={styles.itemIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.itemInput}
              value={editedValue}
              onChangeText={setEditedValue}
              onBlur={handleEdit}
              secureTextEntry={isPassword}
              autoFocus
            />
          ) : (
            <Text style={styles.itemValue}>{value}</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Icon name="pencil" size={20} color="#87CEEB" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleSaveChanges = async () => {
    try {
      // This is where you would typically make an API call to save the data
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Success", "Your details have been updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update details. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Personal Details</Text>
        </View>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('EditPicture')}
          >
            <Image
              source={require('../assets/images/person.png')}
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
            />
            <InfoItem
              icon="calendar"
              label="Date of Birth"
              field="dob"
              value={userDetails.dob}
            />
            <InfoItem
              icon="phone"
              label="Phone Number"
              field="phone"
              value={userDetails.phone}
            />
            <InfoItem
              icon="email"
              label="Email"
              field="email"
              value={userDetails.email}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editOverlay: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: '#87CEEB',
  },
  itemValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  itemInput: {
    fontSize: 16,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#87CEEB',
  },
  saveButton: {
    backgroundColor: '#87CEEB',
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPersonalDetailsScreen;

