import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchProductDetails } from '../Services/productApi';
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
            //Alert.alert('Error', 'Invalid product ID. Please go back and try again.');
        }
    }, [route.params?.productId]);

    const fetchProductData = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProductDetails(productId);
            if (data) {
                setProduct(data);
            } else {
                throw new Error('Product not found');
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(err.message || 'Failed to load product details. Please try again.');
            //Alert.alert('Error', err.message || 'Failed to load product details. Please try again.');
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
                    <WarrantyRow title="Product Name:" value={product.name} />
                    <WarrantyRow title="Description:" value={product.description} />
                    <WarrantyRow title="Key Features:" value={product.keyFeatures.join(', ')} />
                    <WarrantyRow title="Dimensions:" value={product.dimensions} />
                    <WarrantyRow title="Category:" value={product.productCategory} />
                    <WarrantyRow title="Specifications:" value={product.specifications} />
                    {product.warranty && (
                        <>
                            <WarrantyRow title="Warranty Start Date:" value={product.warranty.startDate} />
                            <WarrantyRow title="Warranty End Date:" value={product.warranty.expireDate} />
                            <WarrantyRow title="Warranty Type:" value={product.warranty.warrantyType} />
                            <WarrantyRow title="Warranty Status:" value={product.warranty.status} />
                        </>
                    )}
                </View>

                {/* <View style={styles.coverageContainer}>
                    <Text style={styles.coverageTitle}>Coverage Details:</Text>
                    {product.coverageDetails.map((detail, index) => (
                        <Text key={index} style={styles.coverageItem}>• {detail}</Text>
                    ))}
                </View> */}

                {/* <View style={styles.termsContainer}>
                    <Text style={styles.termsTitle}>Terms and Conditions:</Text>
                    <Text style={styles.termsText}>{product.termsAndConditions}</Text>
                </View> */}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Sparepart', { productId: product.id })}>
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
        paddingBottom: 20,
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
