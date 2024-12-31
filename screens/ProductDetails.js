import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProductDetails({ navigation }) {
    const [clickedLinks, setClickedLinks] = useState({}); // Track clicked links

    const handleLinkClick = (link) => {
        setClickedLinks((prev) => ({ ...prev, [link]: true }));
    };

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
            <View style={styles.mainContent}>
                <ScrollView style={styles.content}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../assets/images/oven.jpg')}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Product Title and Description */}
                    <Text style={styles.productTitle}>RS 600MM Oven</Text>
                    <Text style={styles.description}>
                        Compact 600mm wide static oven range with a number of burner/griddle/chargrills configurations available.{'\n'}
                        Flat bottom oven design for even heat distribution.
                    </Text>

                    {/* Specifications Table */}
                    <View style={styles.specContainer}>
                        <SpecRow title="Dimensions" value="600w x 800d x 1100h" />
                        <SpecRow title="Internal Oven" value="440w x 550d x 300h" />
                        <SpecRow title="Oven Doors" value="Left hinged swing door" />
                        <SpecRow title="Cleaning" value="Dishwasher safe spillage bowls" />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={()  => navigation.navigate('ServiceForm')}>
                            <Text style={styles.buttonText}>Enquire Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={()  => navigation.navigate('WarrantyInformation')} >
                            <Text style={styles.secondaryButtonText}>Warranty Information</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Links */}
                    <View style={styles.linksGrid}>
                        <View style={styles.linksRow}>
                            <TouchableOpacity
                                style={styles.link}
                                onPress={() => handleLinkClick('View Specification')}
                            >
                                <Text
                                    style={[
                                        styles.linkText,
                                        clickedLinks['View Specification'] && styles.linkTextClicked,
                                    ]}
                                >
                                    View Specification
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.link}
                                onPress={() => handleLinkClick('Download CAD Drawing')}
                            >
                                <Text
                                    style={[
                                        styles.linkText,
                                        clickedLinks['Download CAD Drawing'] && styles.linkTextClicked,
                                    ]}
                                >
                                    Download CAD Drawing
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.linksRow}>
                            <TouchableOpacity
                                style={styles.link}
                                onPress={() => handleLinkClick('Revit Files RS-48')}
                            >
                                <Text
                                    style={[
                                        styles.linkText,
                                        clickedLinks['Revit Files RS-48'] && styles.linkTextClicked,
                                    ]}
                                >
                                    Revit Files RS-48
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.link}
                                onPress={() => handleLinkClick('Revit Files RS-6P')}
                            >
                                <Text
                                    style={[
                                        styles.linkText,
                                        clickedLinks['Revit Files RS-6P'] && styles.linkTextClicked,
                                    ]}
                                >
                                    Revit Files RS-6P
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.navbarSpacer} />
            </View>
        </View>
    );
}

// Component for displaying specifications
function SpecRow({ title, value }) {
    return (
        <View style={styles.specRow}>
            <Text style={styles.specTitle}>{title}</Text>
            <Text style={styles.specValue}>{value}</Text>
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
    mainContent: {
        flex: 1,
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
        borderColor: '#FFFFFF', // White border for image
        padding: 16,
        height: 250, // Fixed image size
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
        paddingVertical: 12, // More padding for better separation
        backgroundColor: '#00000',
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
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    navbarSpacer: {
        height: 80, // Extra space for navbar
    },
});
