import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
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
  };

  return (
    <SafeAreaView style={styles.container}>
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
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Render the selected form */}
        {renderForm()}
      </ScrollView>
      <View style={{ height: 70 }} /> {/* Spacer for bottom navbar */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
});