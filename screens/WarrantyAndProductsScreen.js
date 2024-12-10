import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WarrantyAndProductsScreen = () => {
  const products = [
    { id: 1, name: 'BS 600MM Oven', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 2, name: 'SCM-120 Steam Cabinet', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 3, name: 'SCM-60 Steam Cabinet', date: '10 December 2023', warranty: '10 Dec 2028' },
    { id: 4, name: 'BS 1200MM Oven', date: '10 December 2023', warranty: '10 Dec 2028' },
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
    <ScrollView style={styles.container}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
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
    color: '#FFF',
    marginBottom: 5,
  },
  productDate: {
    fontSize: 14,
    color: '#87CEEB',
    marginBottom: 2,
  },
  productWarranty: {
    fontSize: 14,
    color: '#87CEEB',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#87CEEB',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WarrantyAndProductsScreen;