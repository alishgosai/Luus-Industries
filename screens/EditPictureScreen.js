import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const EditPictureScreen = () => {
  const navigation = useNavigation();

  const handleChooseFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      // Handle the selected image
      console.log(pickerResult.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      // Handle the captured image
      console.log(pickerResult.assets[0].uri);
    }
  };

  const handleImportFromFiles = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access files is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      // Handle the imported image
      console.log(pickerResult.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    // Handle photo removal logic
    console.log('Remove photo');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Picture</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={require('../assets/images/person.png')}
          style={styles.profilePicture}
        />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.option}
          onPress={handleChooseFromLibrary}
        >
          <Icon name="folder-image" size={24} color="#87CEEB" />
          <Text style={styles.optionText}>Choose from library</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={handleImportFromFiles}
        >
          <Icon name="download" size={24} color="#87CEEB" />
          <Text style={styles.optionText}>Import from Files</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={handleTakePhoto}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Browse')}>
          <Icon name="magnify" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Scan')}>
          <Icon name="qrcode-scan" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
          <Icon name="chat" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="account" size={24} color="#87CEEB" />
          <Text style={[styles.navText, styles.navTextActive]}>Account</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
    backgroundColor: '#87CEEB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
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
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#121212',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#87CEEB',
  },
  navText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  navTextActive: {
    color: '#87CEEB',
  },
});

export default EditPictureScreen;

