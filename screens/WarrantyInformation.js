import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductApi from '../Services/productApi';
import { useRoute } from '@react-navigation/native';

export default function WarrantyInformation({ navigation }) {
    const route = useRoute();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const productId = route.params?.productId;
        if (productId) {
            console.log('Fetching product details for ID:', productId);
            fetchProductData(productId);
        } else {
            console.error('Product ID is undefined');
            setError('Invalid product ID. Please go back and try again.');
            setLoading(false);
        }
    }, [route.params?.productId]);

    const fetchProductData = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await ProductApi.getProductDetails(productId, true);
            if (response.success) {
                setProduct(response.product);
            } else {
                throw new Error(response.error || 'Failed to load product details');
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(err.message || 'Failed to load product details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#87CEEB" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Product not found'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-left" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Warranty Information</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.imageUrl }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.productTitle}>{product.name}</Text>

                <View style={styles.warrantyContainer}>
                    {/* Removed Registration Date WarrantyRow */}
                    <WarrantyRow 
                        title="Expiry Date:" 
                        value="Expiry valid for 5 Years after the purchase date"
                    />
                    <WarrantyRow title="Status:" value={product.status} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function WarrantyRow({ title, value }) {
    return (
        <View style={styles.warrantyRow}>
            <Text style={styles.warrantyTitle}>{title}</Text>
            <Text style={styles.warrantyValue}>{value}</Text>
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
        marginTop: 16,
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
    },
    contentContainer: {
        paddingBottom: 40,
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
    warrantyContainer: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    warrantyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333333',
    },
    warrantyTitle: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
    },
    warrantyValue: {
        fontSize: 14,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'right',
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
        backgroundColor: '#000000',
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
    },
});

