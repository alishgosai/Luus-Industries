import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductApi from '../Services/productApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarrantyAndProductsScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
      React.useCallback(() => {
        console.log('WarrantyAndProductsScreen focused');
        checkAuthAndFetchProducts();
      }, [])
    );

    const checkAuthAndFetchProducts = async () => {
        const userId = await AsyncStorage.getItem('userId');
        console.log('WarrantyAndProductsScreen: UserId from AsyncStorage:', userId ? 'exists' : 'not found');
        if (userId) {
            ProductApi.setUserId(userId);
            fetchProducts();
        } else {
            console.log('WarrantyAndProductsScreen: No userId found, displaying no products message');
            setLoading(false);
            setProducts([]);
        }
    };

    useEffect(() => {
        console.log('WarrantyAndProductsScreen: Component mounted');
        checkAuthAndFetchProducts().catch(error => {
            console.error('WarrantyAndProductsScreen: Error in checkAuthAndFetchProducts:', error);
            setError('Failed to authenticate. Please try logging in again.');
            setLoading(false);
        });
    }, []);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('WarrantyAndProductsScreen: Fetching products with userId:', ProductApi.userId);
        const response = await ProductApi.getUserProducts();
        console.log('WarrantyAndProductsScreen: getUserProducts response:', JSON.stringify(response));
        if (response.success) {
          setProducts(response.products);
        } else {
          console.error('WarrantyAndProductsScreen: Failed to fetch products:', response.error);
          setError(response.error || 'Failed to load products');
          setProducts([]);
        }
      } catch (err) {
        console.error('WarrantyAndProductsScreen: Error fetching registered products:', err);
        setError(err.message || 'Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const getValidImageUrl = (product) => {
      if (product.productDetails?.storedImageUrl) {
        return product.productDetails.storedImageUrl;
      }
      if (product.imageUrl && !product.imageUrl.includes('C:\\')) {
        return product.imageUrl;
      }
      return 'https://via.placeholder.com/150?text=No+Image';
    };

    const deleteProduct = async (userProductId) => {
      console.log('Attempting to delete product with ID:', userProductId);
      try {
        setLoading(true);
        const response = await ProductApi.deleteUserProduct(userProductId);
        if (response.success) {
          setProducts(prevProducts => prevProducts.filter(product => product.userProductId !== userProductId));
          Alert.alert('Success', 'Product deleted successfully');
        } else {
          setError('Failed to delete product. Please try again.');
          Alert.alert('Error', response.error || 'Failed to delete product');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('An error occurred while deleting the product.');
        Alert.alert('Error', 'An error occurred while deleting the product');
      } finally {
        setLoading(false);
      }
    };

    const ProductCard = ({ product }) => {
        console.log('Product in ProductCard:', JSON.stringify(product, null, 2));
        const productName = product.productDetails ? product.productDetails.name : (product.name || 'Unknown Product');
        const imageUrl = getValidImageUrl(product);
        const userProductId = product.userProductId;

        return (
            <View style={styles.productCard}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={(e) => console.error('Error loading image:', imageUrl, e.nativeEvent.error)}
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{productName}</Text>
                    {product.warranty && (
                        <Text style={styles.productWarranty}>Warranty End Date: {new Date(product.warranty.expireDate).toLocaleDateString()}</Text>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.detailsButton} 
                            onPress={() => {
                                console.log('WarrantyAndProductsScreen: Navigating to ProductDetails with productId:', product.productId);
                                navigation.navigate('ProductDetails', { productId: product.productId });
                            }}
                        >
                            <Text style={styles.detailsButtonText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.sparePartsButton} 
                            onPress={() => {
                                console.log('WarrantyAndProductsScreen: Navigating to SpareParts');
                                navigation.navigate('SparePart', { productId: product.productId });
                            }}
                        >
                            <Text style={styles.sparePartsButtonText}>Spare Parts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.deleteButton} 
                            onPress={() => {
                                Alert.alert(
                                    "Delete Product",
                                    "Are you sure you want to delete this product?",
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        },
                                        { 
                                            text: "OK", 
                                            onPress: () => deleteProduct(userProductId)
                                        }
                                    ]
                                );
                            }}
                        >
                            <Icon name="delete" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

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
                      <TouchableOpacity style={styles.retryButton} onPress={() => checkAuthAndFetchProducts()}>
                          <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                  </View>
              ) : products.length === 0 ? (
                  <View style={styles.noProductsContainer}>
                      <Text style={styles.noProductsText}>No registered products found.</Text>
                      <Text style={styles.noProductsSubText}>Register a product by scanning QR to see it here.</Text>
                  </View>
              ) : (
                  products.map((product) => (
                      <ProductCard key={product.userProductId || product.id} product={product} />
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
        backgroundColor: '#2A2A2A',
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
    productWarranty: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    detailsButton: {
        backgroundColor: '#87CEEB',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    detailsButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    sparePartsButton: {
        backgroundColor: '#87CEEB',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    sparePartsButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF4136',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
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

