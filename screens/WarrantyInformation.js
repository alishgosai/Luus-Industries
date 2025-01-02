import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API_URL from '../backend/config/api';

export default function WarrantyInformation({ navigation, route }) {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        } else {
            console.error('Product ID is undefined');
            setError('Invalid product ID. Please go back and try again.');
            setLoading(false);
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching product details for ID:', productId);
            const response = await fetch(`${API_URL}/api/products/warranty-products/${productId}`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch product details. Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched product details:', data);
            setProduct(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(err.message || 'Failed to load product details. Please try again.');
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
                <TouchableOpacity style={styles.retryButton} onPress={fetchProductDetails}>
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
        <SafeAreaView style={[styles.container, { paddingBottom: 20 }]}>
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
                        source={getProductImage(product.id)}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.productTitle}>{product.name}</Text>

                <View style={styles.warrantyContainer}>
                    <WarrantyRow title="Date Purchased:" value={product.date} />
                    <WarrantyRow title="Warranty Type:" value="5 Years" />
                    <WarrantyRow title="Warranty End Date:" value={product.warranty} />
                    <WarrantyRow title="Serial Number:" value={product.serialNumber} />
                    <WarrantyRow title="Purchase Location:" value={product.purchaseLocation} />
                    <WarrantyRow title="Additional Info:" value={product.details} />
                </View>

                <View style={styles.coverageContainer}>
                    <Text style={styles.coverageTitle}>Coverage Details:</Text>
                    {product.coverageDetails.map((detail, index) => (
                        <Text key={index} style={styles.coverageItem}>• {detail}</Text>
                    ))}
                </View>

                <View style={styles.termsContainer}>
                    <Text style={styles.termsTitle}>Terms and Conditions:</Text>
                    <Text style={styles.termsText}>{product.termsAndConditions}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SparePart', { productId: product.id })}>
                        <Text style={styles.buttonText}>Spare Parts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('ServiceForm', { productId: product.id })}>
                        <Text style={styles.buttonText}>Book a Service</Text>
                    </TouchableOpacity>
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
        paddingBottom: 40, // Increase bottom padding
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
    coverageContainer: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    coverageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 8,
    },
    coverageItem: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    termsContainer: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    termsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#87CEEB',
        marginBottom: 8,
    },
    termsText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginHorizontal: 16,
        gap: 12,
        paddingBottom: 20, // Add padding to the bottom of the button container
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

