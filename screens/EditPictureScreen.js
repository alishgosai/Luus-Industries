import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const EditPictureScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const handleImageSelection = async (type) => {
    const permissionGranted = await requestPermission();
    if (!permissionGranted) return;

    let result;
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    setImage(null);
    Alert.alert("Photo Removed", "Your profile picture has been removed.");
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

