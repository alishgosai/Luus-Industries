import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import API_URL from '../backend/config/api';

const EditPictureScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfilePicture = useCallback(async () => {
    try {
      console.log('Fetching profile picture...');
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      const response = await fetch(`${API_URL}/user/user-profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      console.log('Fetched user data:', data);
      if (data.avatar) {
        // Ensure the avatar URL is absolute and remove any double slashes
        const avatarUrl = data.avatar.startsWith('http') 
          ? data.avatar.replace(/([^:]\/)\/+/g, "$1")
          : `${API_URL}${data.avatar}`.replace(/([^:]\/)\/+/g, "$1");
        setImage(avatarUrl);
        console.log('Profile picture set:', avatarUrl);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      Alert.alert('Error', 'Failed to fetch profile picture');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfilePicture();
    }, [fetchProfilePicture])
  );

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const resizeImage = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('Original file size:', fileInfo.size);
      
      // If file size is greater than 1MB, resize it
      if (fileInfo.size > 1024 * 1024) {
        console.log('Image needs resizing');
        const resizedUri = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log('Resized image uri:', resizedUri.uri);
        return resizedUri.uri;
      }
      return uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      return uri;
    }
  };

  const handleImageSelection = async (type) => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    setIsLoading(true);
    let result;
    
    try {
      if (type === 'library') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else if (type === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      console.log('Image picker result:', result);

      if (!result.canceled) {
        const resizedUri = await resizeImage(result.assets[0].uri);
        await uploadImage(resizedUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (uri) => {
    console.log('Uploading image:', uri);
    
    // Create proper file URI for iOS
    const fileUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    
    const formData = new FormData();
    formData.append('image', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    });

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Sending request to:', `${API_URL}/user/update-profile-picture/${userId}`);
      const response = await fetch(`${API_URL}/user/update-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Invalid response format from server');
      }

      if (data.avatar) {
        // Ensure the avatar URL is absolute and remove any double slashes
        const avatarUrl = data.avatar.startsWith('http') 
          ? data.avatar.replace(/([^:]\/)\/+/g, "$1")
          : `${API_URL}${data.avatar}`.replace(/([^:]\/)\/+/g, "$1");
        setImage(avatarUrl);
        console.log('Image updated successfully:', avatarUrl);
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
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      const response = await fetch(`${API_URL}/user/remove-profile-picture/${userId}`, {
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
        Alert.alert('Error', data.message || 'Failed to remove profile picture');
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
            {isLoading ? (
              <View style={[styles.profilePicture, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#87CEEB" />
              </View>
            ) : (
              <Image
                source={image ? { uri: image } : require("../assets/images/person.png")}
                style={styles.profilePicture}
                onError={(e) => {
                  console.error('Error loading image:', e.nativeEvent.error);
                  setImage(null);
                }}
              />
            )}
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleImageSelection('library')}
              disabled={isLoading}
            >
              <Icon name="folder-image" size={24} color="#87CEEB" />
              <Text style={styles.optionText}>Choose from library</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleImageSelection('camera')}
              disabled={isLoading}
            >
              <Icon name="camera" size={24} color="#87CEEB" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, styles.removeOption]}
              onPress={handleRemovePhoto}
              disabled={isLoading || !image}
            >
              <Icon name="trash-can-outline" size={24} color={image ? "#FF0000" : "#666666"} />
              <Text style={[styles.removeText, !image && styles.disabledText]}>
                Remove Current Photo
              </Text>
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
    backgroundColor: '#2A2A2A',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    opacity: 1,
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
  disabledText: {
    color: '#666666',
  },
});

export default EditPictureScreen;

