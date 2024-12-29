import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WarrantyInformation({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-left" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Warranty Information</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/oven.jpg')}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Product Title */}
                <Text style={styles.productTitle}>RS 600MM Oven</Text>

                {/* Warranty Details */}
                <View style={styles.warrantyContainer}>
                    <WarrantyRow title="Date Purchased:" value="10 December 2023" />
                    <WarrantyRow title="Warranty type:" value="5 Years" />
                    <WarrantyRow title="Warranty End Date:" value="10 December 2028" />
                    <WarrantyRow title="Additional info" value="Additional Info" />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={()  => navigation.navigate('SparePart')}  >
                        <Text style={styles.buttonText}>Spare Parts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()  => navigation.navigate('ServiceForm')}  >
                        <Text style={styles.buttonText}>Book a Service</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// Component for displaying warranty information rows
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
        marginTop: 55,
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
        marginTop: 16,
    },
    imageContainer: {
        backgroundColor: '#000000',
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
        padding: 20,
        aspectRatio: 4/3, 
        height: '50%', 
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    productTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 16,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    warrantyContainer: {
        marginHorizontal: 16,
    },
    warrantyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    warrantyTitle: {
        fontSize: 15,
        color: '#FFFFFF',
        
    },
    warrantyValue: {
        fontSize: 15,
        color: '#FFFFFF',
        textAlign: 'left',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginHorizontal: 16,
        gap: 12,
        marginBottom: 32,
    },
    button: {
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
});
