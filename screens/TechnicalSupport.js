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

export default function TechnicalSupportForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    location: '',
    message: '',
  });
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Attached image:', image);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="First/Surname"
              placeholderTextColor="#666"
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number*</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile/Landline"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              placeholderTextColor="#666"
              onChangeText={(text) => setFormData({ ...formData, businessName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location*</Text>
            <TextInput
              style={styles.input}
              placeholder="City/Postcode"
              placeholderTextColor="#666"
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message*</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Describe your problem here!"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
            />
          </View>

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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="scan" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  attachmentSection: {
    marginBottom: 24,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
  attachedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 16,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#87CEEB',
    fontSize: 12,
    marginTop: 4,
  },
});

