import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductApi from '../Services/productApi';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedLinks, setClickedLinks] = useState({});

  const route = useRoute();
  const navigation = useNavigation();
  const { productId, isNewProduct } = route.params || {};

  useEffect(() => {
    loadProductDetails(productId);
  }, [productId]);

  const loadProductDetails = async (productId) => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }
      ProductApi.setUserId(userId);

      const result = await ProductApi.getProductDetails(productId);
      if (result.success && result.product) {
        setProduct(result.product);
        setError(null);
        
        if (result.newlyRegistered) {
          Alert.alert(
            'New Product Registered',
            'This product has been registered to your account.',
            [{ text: 'OK' }]
          );
        }
      } else {
        throw new Error(result.error || 'Failed to load product details');
      }
    } catch (err) {
      console.error('Error in loadProductDetails:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (link) => {
    try {
      if (await Linking.canOpenURL(link.url)) {
        await Linking.openURL(link.url);
        setClickedLinks(prev => ({ ...prev, [link.title]: true }));
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => loadProductDetails(productId)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.productTitle}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.specContainer}>
          {product.specifications.map((spec, index) => (
            <View key={index} style={styles.specRow}>
              <Text style={styles.specTitle}>{spec.title}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>

        {product.warranty && (
          <View style={styles.warrantyContainer}>
            <Text style={styles.warrantyTitle}>Warranty Information</Text>
            <Text style={styles.warrantyText}>Start Date: {formatDate(product.warranty.startDate)}</Text>
            <Text style={styles.warrantyText}>Expiry Date: {formatDate(product.warranty.expireDate)}</Text>
            <Text style={styles.warrantyText}>Status: {product.warranty.status}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ServiceForm', { productId: product.id })}>
            <Text style={styles.buttonText}>Enquire Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('WarrantyInformation', { productId: product.id })}>
            <Text style={styles.secondaryButtonText}>Warranty Information</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linksGrid}>
          {product.links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.link}
              onPress={() => handleLinkClick(link)}
            >
              <Text
                style={[
                  styles.linkText,
                  clickedLinks[link.title] && styles.linkTextClicked,
                ]}
              >
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    marginHorizontal: 16,
    marginTop: 55,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  imageContainer: {
    backgroundColor: '#000000',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 0.2,
    borderColor: '#FFFFFF',
    padding: 16,
    height: 250,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginTop: 16,
    marginHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    marginHorizontal: 16,
    lineHeight: 20,
  },
  specContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  specTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
  },
  warrantyContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
  },
  warrantyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 8,
  },
  warrantyText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  linksGrid: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  link: {
    flex: 1,
    marginHorizontal: 4,
  },
  linkText: {
    color: '#87CEEB',
    fontSize: 14,
  },
  linkTextClicked: {
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});

