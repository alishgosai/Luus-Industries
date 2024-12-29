import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProductInfo({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Info</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView style={styles.content}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/oven.jpg')}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          {/* Product Title and Description */}
          <Text style={styles.productTitle}>RS 600MM Oven</Text>
          <Text style={styles.description}>
            Compact 600mm wide static oven range with a number of burner/griddle/chargrills configurations available. Flat bottom oven design for even heat distribution.
          </Text>

          {/* Specifications */}
          <View style={styles.specContainer}>
            <SpecRow title="Dimensions" value="600w x 800d x 1100h" />
            <SpecRow title="Internal Oven" value="440w x 550d x 300h" />
            <SpecRow title="Oven Doors" value="Left hinged swing door" />
            <SpecRow title="Cleaning" value="Dishwasher safe spillage bowls" />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Enquire Now</Text>
            </TouchableOpacity>
          </View>

          {/* Links */}
          <View style={styles.linksGrid}>
            <View style={styles.linksRow}>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>View Specification</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Download CAD Drawing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.linksRow}>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Revit Files RS-48</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Revit Files RS-6P</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Component for displaying specifications
function SpecRow({ title, value }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specTitle}>{title}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 30,
    marginHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
  },
  imageContainer: {
    marginHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 16,
    marginTop: 8,
    lineHeight: 20,
  },
  specContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  specTitle: {
    fontSize: 14,
    color: '#fff',
  },
  specValue: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  linksGrid: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  link: {
    flex: 1,
    marginHorizontal: 4,
  },
  linkText: {
    color: '#87CEEB',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
