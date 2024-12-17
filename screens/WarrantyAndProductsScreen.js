import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavBar from "../components/BottomNavBar";

const WarrantyAndProductsScreen = () => {
  const navigation = useNavigation();

  const products = [
    { id: 1, name: 'RS 600MM Oven', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 2, name: 'SCM-120 Steam Cabinet', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 3, name: 'SCM-60 Steam Cabinet', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 4, name: 'RS 600MM Oven', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 5, name: 'RS 600MM Oven', date: '10 December 2023', warranty: '10 Dec 2028' },
  ];

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <Image
        source={require('../assets/images/oven.jpg')}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDate}>Date Bought: {product.date}</Text>
        <Text style={styles.productWarranty}>Warranty End Date: {product.warranty}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Warranty Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Warranty & Products</Text>
      </View>
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Space for BottomNavBar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32, // Add padding to prevent overlap with BottomNavBar
  },
  productCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  productInfo: {
    marginLeft: 15,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 5,
  },
  productDate: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  productWarranty: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  detailsButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 70, // Adds spacing for the BottomNavBar
  },
});

export default WarrantyAndProductsScreen;
