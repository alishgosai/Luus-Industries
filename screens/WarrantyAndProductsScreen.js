import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductApi from "../Services/productApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarrantyAndProductsScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState(null); // Update 1: Initial state of products is null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuthAndFetchProducts = async () => {
        const userId = await AsyncStorage.getItem('userId');
        console.log('WarrantyAndProductsScreen: UserId from AsyncStorage:', userId ? 'exists' : 'not found');
        if (userId) {
            fetchProducts(userId);
        } else {
            console.log('WarrantyAndProductsScreen: No userId found, displaying no products message');
            setLoading(false);
            setProducts(null); // Update 1: Set products to null
        }
    };

    useFocusEffect(
      useCallback(() => {
        console.log('WarrantyAndProductsScreen: Screen focused');
        checkAuthAndFetchProducts().catch(error => {
          console.error('WarrantyAndProductsScreen: Error in checkAuthAndFetchProducts:', error);
          setError('Failed to authenticate. Please try logging in again.');
          setLoading(false);
        });
      }, [])
    );

    const fetchProducts = async (userId) => { // Update 3: Added more logging
        try {
            setLoading(true);
            setError(null);
            console.log('WarrantyAndProductsScreen: Fetching products with userId:', userId); // Update 3
            ProductApi.setUserId(userId); // Update 3
            const response = await ProductApi.getUserProducts();
            console.log('WarrantyAndProductsScreen: getUserProducts response:', JSON.stringify(response, null, 2)); // Update 3
            if (response.success) {
                console.log('WarrantyAndProductsScreen: Number of products fetched:', response.products.length); // Update 3
                setProducts(response.products);
            } else {
                console.error('WarrantyAndProductsScreen: Failed to fetch products:', response.error);
                setError(response.error || 'Failed to load products');
                setProducts(null); // Update 1: Set products to null
            }
        } catch (err) {
            console.error('WarrantyAndProductsScreen: Error fetching registered products:', err);
            setError(err.message || 'Failed to load products. Please try again.');
            setProducts(null); // Update 1: Set products to null
        } finally {
            setLoading(false);
        }
    };


    const ProductCard = ({ product }) => (
        <View style={styles.productCard}>
            <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDate}>Date Registered: {new Date(product.registrationDate).toLocaleDateString()}</Text>
                {product.warranty && (
                    <Text style={styles.productWarranty}>Warranty End Date: {new Date(product.warranty.expireDate).toLocaleDateString()}</Text>
                )}
                <TouchableOpacity 
                    style={styles.detailsButton} 
                    onPress={() => {
                        console.log('WarrantyAndProductsScreen: Navigating to WarrantyInformation with productId:', product.id);
                        navigation.navigate('WarrantyInformation', { productId: product.id });
                    }}
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

    return (
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
              <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
              >
                  <Icon name="chevron-left" size={24} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Products</Text>
          </View>
          
          <ScrollView 
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
          >
              {loading ? (
                  <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#87CEEB" />
                  </View>
              ) : error ? (
                  <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                      <TouchableOpacity style={styles.retryButton} onPress={checkAuthAndFetchProducts}>
                          <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                  </View>
              ) : products === null || products.length === 0 ? ( // Update 2: Check if products is null or empty
                  <View style={styles.noProductsContainer}>
                      <Text style={styles.noProductsText}>No registered products found.</Text>
                      <Text style={styles.noProductsSubText}>Register a product by scanning QR to see it here.</Text>
                  </View>
              ) : (
                  products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                  ))
              )}
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
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#87CEEB',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noProductsText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    noProductsSubText: {
        color: '#AAAAAA',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default WarrantyAndProductsScreen;

