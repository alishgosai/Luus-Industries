import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    location: '',
    message: ''
  });

  const categories = [
    'Service/Warranty',
    'Technical Support',
    'Equipment Sales',
    'Care'
  ];

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="First/Surname"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number*</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile/Landline"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              placeholderTextColor="#666"
              value={formData.businessName}
              onChangeText={(text) => setFormData({...formData, businessName: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location*</Text>
            <TextInput
              style={styles.input}
              placeholder="City/Postcode"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
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
              value={formData.message}
              onChangeText={(text) => setFormData({...formData, message: text})}
            />
          </View>

          {/* Image Attachment Options */}
          <Text style={styles.label}>Attach Image</Text>
          <View style={styles.attachmentOptions}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Icon name="camera-outline" size={24} color="#87CEEB" />
              <Text style={styles.attachmentText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentButton}>
              <Icon name="document-outline" size={24} color="#87CEEB" />
              <Text style={styles.attachmentText}>Import from Files</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="search-outline" size={24} color="#000" />
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="scan-outline" size={24} color="#000" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chatbubble-outline" size={24} color="#000" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color="#000" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
    backgroundColor: '#87CEEB',
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 16,
    color: '#000',
    fontWeight: '500',
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
  categoryText: {
    color: '#FFF',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1C',
    borderRadius: 4,
    padding: 12,
    color: '#FFF',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachmentOptions: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentText: {
    color: '#87CEEB',
  },
  submitButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: '#000',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#87CEEB',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
});