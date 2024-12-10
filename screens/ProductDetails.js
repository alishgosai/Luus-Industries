import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProductDetails() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="arrow-back" size={24} color="#000" />
                <Text style={styles.headerTitle}>Product Details</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.content}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/oven.jpg')} // Ensure this path is correct
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Product Info */}
                <Text style={styles.productTitle}>RS 600MM Oven</Text>
                <Text style={styles.description}>
                    Compact 600mm wide static oven range with a number of burner/griddle/chargrills configurations available.
                    Flat bottom oven design for even heat distribution.
                </Text>

                {/* Specifications */}
                <View style={styles.specContainer}>
                    <SpecRow title="Dimensions" value="600w x 800d x 1100h" />
                    <SpecRow title="Internal Oven" value="440w x 550d x 300h" />
                    <SpecRow title="Oven Doors" value="Left hinged swing door" />
                    <SpecRow title="Cleaning" value="Dishwasher safe spillage bowls" />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Enquire Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Warranty Information</Text>
                    </TouchableOpacity>
                </View>

                {/* Links */}
                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.linkText}>View Specification</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.linkText}>Download CAD Drawing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.linkText}>Revit Files RS-48</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.linkText}>Revit Files RS-6P</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <NavItem icon="home" label="Home" />
                <NavItem icon="search" label="Browse" />
                <NavItem icon="scan" label="Scan" />
                <NavItem icon="person" label="Profile" />
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

// Component for bottom navigation item
function NavItem({ icon, label }) {
    return (
        <TouchableOpacity style={styles.navItem}>
            <Icon name={icon} size={24} color="#000" />
            <Text style={styles.navLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    headerTitle: {
        marginLeft: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    productImage: {
        width: 200,
        height: 200,
    },
    productTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
        lineHeight: 20,
    },
    specContainer: {
        marginVertical: 16,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    specTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    specValue: {
        fontSize: 14,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginVertical: 16,
    },
    link: {
        marginBottom: 8,
    },
    linkText: {
        color: '#007BFF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f5f5f5',
    },
    navItem: {
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
});
