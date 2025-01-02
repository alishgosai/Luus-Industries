import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import API_URL from '../backend/config/api';

const EditPictureScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      console.log('Fetching profile picture...');
      const response = await fetch(`${API_URL}/user/user-profile`);
      const data = await response.json();
      console.log('Fetched user data:', data);
      if (data.avatar) {
        setImage(data.avatar);
        console.log('Profile picture set:', data.avatar);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      Alert.alert('Error', 'Failed to fetch profile picture');
    }
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const handleImageSelection = async (type) => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    let result;
    try {
      if (type === 'library') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else if (type === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      console.log('Image picker result:', result);

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const uploadImage = async (uri) => {
    console.log('Uploading image:', uri);
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    });

    try {
      console.log('Sending request to:', `${API_URL}/user/update-profile-picture`);
      const response = await fetch(`${API_URL}/user/update-profile-picture`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response data:', data);

      if (data.success) {
        setImage(data.imageUrl);
        console.log('Image updated successfully:', data.imageUrl);
        Alert.alert('Success', 'Profile picture updated successfully');
      } else {
        console.error('Failed to update profile picture:', data.message);
        Alert.alert('Error', 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image: ' + error.message);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      console.log('Removing profile picture...');
      const response = await fetch(`${API_URL}/user/remove-profile-picture`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Remove photo response:', data);
      if (data.success) {
        setImage(null);
        console.log('Profile picture removed successfully');
        Alert.alert("Photo Removed", "Your profile picture has been removed.");
      } else {
        console.error('Failed to remove profile picture:', data.message);
        Alert.alert('Error', 'Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      Alert.alert('Error', 'Failed to remove profile picture: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Picture</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.profilePictureContainer}>
            <Image
              source={image ? { uri: image } : require('../assets/images/person.png')}
              style={styles.profilePicture}
            />
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleImageSelection('library')}
            >
              <Icon name="folder-image" size={24} color="#87CEEB" />
              <Text style={styles.optionText}>Choose from library</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleImageSelection('camera')}
            >
              <Icon name="camera" size={24} color="#87CEEB" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, styles.removeOption]}
              onPress={handleRemovePhoto}
            >
              <Icon name="trash-can-outline" size={24} color="#FF0000" />
              <Text style={styles.removeText}>Remove Current Photo</Text>
            </TouchableOpacity>
          </View>
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
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  optionsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  removeOption: {
    marginTop: 16,
    borderBottomWidth: 0,
  },
  removeText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FF0000',
  },
});

export default EditPictureScreen;

