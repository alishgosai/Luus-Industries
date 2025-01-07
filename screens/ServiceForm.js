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
<<<<<<< HEAD
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
=======
import Icon from 'react-native-vector-icons/Ionicons';
import EquipmentSalesForm from '../components/EquipmentSalesForm';
import WarrantyServiceForm from '../components/WarrantyServiceForm';
import TechnicalSupportForm from '../components/TechnicalSupport';

export default function ServiceForm({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Warranty Service');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { 
      key: 'Warranty Service', 
      component: <WarrantyServiceForm 
                   image={image} 
                   isLoading={isLoading} 
                   onSelectImage={setImage} 
                   onSetLoading={setIsLoading} 
                 /> 
    },
    { 
      key: 'Equipment Sales', 
      component: <EquipmentSalesForm 
                   image={image} 
                   isLoading={isLoading} 
                   onSelectImage={setImage} 
                   onSetLoading={setIsLoading} 
                 /> 
    },
    { 
      key: 'Technical Support', 
      component: <TechnicalSupportForm 
                   image={image} 
                   isLoading={isLoading} 
                   onSelectImage={setImage} 
                   onSetLoading={setIsLoading} 
                 /> 
    },
  ];

  const renderForm = () => {
    const selected = categories.find(cat => cat.key === selectedCategory);
    return selected ? selected.component : null;
>>>>>>> 036fb80f9f1ad0dd4d936b505a021a54cfba3fd6
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
<<<<<<< HEAD
      <ScrollView>
        {/* ... (previous JSX remains the same) */}

        <View style={styles.attachmentSection}>
          <Text style={styles.label}>Attach Image</Text>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#87CEEB" />
              <Text style={styles.attachButtonText}>Take Photo</Text>
=======
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryPill, selectedCategory === category.key && styles.selectedCategoryPill]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text style={[styles.categoryText, selectedCategory === category.key && styles.selectedCategoryText]}>
                {category.key}
              </Text>
>>>>>>> 036fb80f9f1ad0dd4d936b505a021a54cfba3fd6
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
<<<<<<< HEAD
=======
      <View style={{ height: 70 }} /> {/* Spacer for bottom navbar */}
>>>>>>> 036fb80f9f1ad0dd4d936b505a021a54cfba3fd6
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  // ... (previous styles remain the same)
  attachedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 16,
    borderRadius: 8,
=======
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    padding: 12,
    margin: 16,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    flex: 1,
  },
  categories: {
    padding: 16,
  },
  categoryPill: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryPill: {
    backgroundColor: '#87CEEB',
  },
  categoryText: {
    color: '#FFF',
  },
  selectedCategoryText: {
    color: '#000',
>>>>>>> 036fb80f9f1ad0dd4d936b505a021a54cfba3fd6
  },
});

