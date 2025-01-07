import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    location: '',
    businessType: '',
    requiredDate: '',
    problemDescription: '',
  });
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Image:', image);
    // Add your form submission logic here
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const importFromFiles = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ... (rest of the component remains the same)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* ... (previous JSX remains the same) */}

        <View style={styles.attachmentSection}>
          <Text style={styles.label}>Attach Image</Text>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#87CEEB" />
              <Text style={styles.attachButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={importFromFiles}>
              <Ionicons name="document" size={24} color="#87CEEB" />
              <Text style={styles.attachButtonText}>Import from Files</Text>
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.attachedImage} />}
        </View>

        {/* ... (rest of the JSX remains the same) */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  attachedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 16,
    borderRadius: 8,
  },
});

