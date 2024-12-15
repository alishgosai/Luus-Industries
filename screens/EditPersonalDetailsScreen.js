import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditPersonalDetailsScreen = () => {
  const navigation = useNavigation();

  const InfoItem = ({ icon, label, value, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    return (
      <View style={styles.infoItem}>
        <Icon name={icon} size={24} color="#FFFFFF" style={styles.itemIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.itemInput}
              value={editedValue}
              onChangeText={setEditedValue}
              onBlur={() => {
                setIsEditing(false);
                onEdit(editedValue);
              }}
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

  const handleEdit = (field, newValue) => {
    // Update the state or make an API call to update the user's information
    console.log(`Updating ${field} to ${newValue}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Personal Details</Text>
      </View>
      <ScrollView>
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
            value="Luxe User"
            onEdit={(newValue) => handleEdit('name', newValue)}
          />
          <InfoItem
            icon="calendar"
            label="Date of Birth"
            value="21/09/2000"
            onEdit={(newValue) => handleEdit('dob', newValue)}
          />
          <InfoItem
            icon="phone"
            label="Phone Number"
            value="941234567"
            onEdit={(newValue) => handleEdit('phone', newValue)}
          />
          <InfoItem
            icon="email"
            label="Email"
            value="luxeuser@luxe.com"
            onEdit={(newValue) => handleEdit('email', newValue)}
          />
          <InfoItem
            icon="lock"
            label="Password"
            value="********"
            onEdit={(newValue) => handleEdit('password', newValue)}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            // Save changes logic here
            navigation.goBack();
          }}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#87CEEB',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
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
    padding: 20,
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
    margin: 20,
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

