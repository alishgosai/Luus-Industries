import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const sparePartsData = [
    {
        id: '107089',
        name: '3/4 LP Gas Appliance Regulator C/W Test Point',
        image: require('../assets/images/Regulator.png'),
        compatibility: 'BCH, CRO, CS, DRO, GTS, NC, PC, RC, RS, SCM, SM, WF'
    },
    {
        id: '107220',
        name: 'Electrode Alpha C/W Integral Cable 400mm',
        image: require('../assets/images/Electrode.png'),
        compatibility: 'CS, GTS, RS, YC'
    },
    {
        id: '108293',
        name: 'Adaptor Brass 10mm suit Eurosit 630',
        image: require('../assets/images/Adaptor.png'),
        compatibility: 'RS'
    }
];



export default function SparePartsScreen({ navigation }) {
    const openWebsite = () => {
        Linking.openURL('https://luus.com.au/spareparts/');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-left" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Spare Parts</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items"
                    placeholderTextColor="#999999"
                />
                <Icon name="magnify" size={24} color="#FFFFFF" />
            </View>

            {/* Spare Parts List */}
            <View style={styles.scrollViewWrapper}>
                <ScrollView style={styles.partsList}>
                    {sparePartsData.map((part, index) => (
                        <View key={index} style={styles.partCard}>
                            <Image 
                                source={part.image}
                                style={styles.partImage}
                                resizeMode="contain"
                            />
                            <View style={styles.partInfo}>
                                <Text style={styles.partName}>{part.name}</Text>
                                <Text style={styles.partId}>Part ID: {part.id}</Text>
                                <Text style={styles.compatibility}>
                                    Compatibility: {part.compatibility}
                                </Text>
                                <TouchableOpacity style={styles.purchaseButton} onPress={openWebsite}>
                                    <Text style={styles.purchaseButtonText}>
                                        Purchase on Website
                                    </Text>
                                    <Icon name="open-in-new" size={16} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={[styles.navbarSpacer, { height: 40 }]} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#87CEEB',
        marginHorizontal: 16,
        marginTop: 11,
        paddingVertical: 12,
        paddingHorizontal: 12,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    menuIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 8,
        padding: 8,
    },
    partsList: {
        marginTop: 16,
    },
    scrollViewWrapper: {
        flex: 1,
    },
    partCard: {
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    partImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#000000',
    },
    partInfo: {
        padding: 16,
    },
    partName: {
        color: '#87CEEB',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    partId: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
    },
    compatibility: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 16,
    },
    purchaseButton: {
        backgroundColor: '#87CEEB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    purchaseButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
    },
    navbarSpacer: {
        height: 40,
    },
});

