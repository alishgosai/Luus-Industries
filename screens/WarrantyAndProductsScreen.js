import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API_URL from '../backend/config/api';

const WarrantyAndProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products/warranty-products`);
      if (!response.ok) {
        throw new Error('Failed to fetch warranty products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching warranty products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (id) => {
    switch (id) {
      case 1:
        return require('../assets/images/oven.jpg');
      case 2:
        return require('../assets/images/SCM-120.png');
      case 3:
        return require('../assets/images/SCM-60.png');
      case 4:
        return require('../assets/images/YC-750mm.jpg');
      case 5:
        return require('../assets/images/RC-450mm.jpg');
      default:
        return null;
    }
  };

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <Image
        source={getProductImage(product.id)}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDate}>Date Bought: {product.date}</Text>
        <Text style={styles.productWarranty}>Warranty End Date: {product.warranty}</Text>
        <TouchableOpacity 
          style={styles.detailsButton} 
          onPress={() => navigation.navigate('WarrantyInformation', { productId: product.id })}
        >
          <Text style={styles.detailsButtonText}>View Warranty Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#87CEEB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Warranty & Products</Text>
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  noImagePlaceholder: {
    backgroundColor: '#2E2E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WarrantyAndProductsScreen;

