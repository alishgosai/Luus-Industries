import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSpareParts, searchSpareParts } from '../Services/sparepartsAPI';

const SparePartsScreen = ({ navigation }) => {
  const [spareParts, setSpareParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParts, setFilteredParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpareParts();
  }, []);

  useEffect(() => {
    filterParts();
  }, [searchQuery, spareParts]);

  const loadSpareParts = async () => {
    try {
      setIsLoading(true);
      const parts = await fetchSpareParts();
      setSpareParts(parts);
      setFilteredParts(parts);
      setError(null);
    } catch (err) {
      setError('Failed to load spare parts. Please try again.');
      console.error('Error fetching spare parts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterParts = async () => {
    if (searchQuery.trim() === '') {
      setFilteredParts(spareParts);
    } else {
      try {
        const searchResults = await searchSpareParts(searchQuery);
        setFilteredParts(searchResults);
      } catch (err) {
        console.error('Error searching spare parts:', err);
        // If search fails, fall back to local filtering by suits
        const filtered = spareParts.filter(part => 
          part.suits && part.suits.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredParts(filtered);
      }
    }
  };

  const openWebsite = (url) => {
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading spare parts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSpareParts}>
          <Text style={styles.retryButtonText}>Retry</Text>
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
        <Text style={styles.headerTitle}>Spare Parts</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by model (e.g., NG, PG, RC)"
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="magnify" size={24} color="#FFFFFF" />
      </View>

      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.partsList}>
          {filteredParts.map((part) => (
            <View key={part.partId} style={styles.partCard}>
              <Image 
                source={{ uri: part.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.partImage}
                resizeMode="contain"
              />
              <View style={styles.partInfo}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.partId}>Part ID: {part.partId}</Text>
                <Text style={styles.price}>Price: {part.price}</Text>
                <Text style={styles.productDetails}>{part.productDetails}</Text>
                <Text style={styles.suits}>Suits: {part.suits || 'N/A'}</Text>
                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => openWebsite('https://luus.com.au/spareparts/')}
                >
                  <Text style={styles.detailsButtonText}>
                    Purchase on Website
                  </Text>
                  <Icon name="open-in-new" size={16} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.navbarSpacer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
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
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    padding: 8,
  },
  scrollViewWrapper: {
    flex: 1,
  },
  partsList: {
    marginTop: 16,
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
  price: {
    color: '#87CEEB',
    fontSize: 14,
    marginBottom: 4,
  },
  productDetails: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  suits: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  },
  detailsButton: {
    backgroundColor: '#87CEEB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  detailsButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  navbarSpacer: {
    height: 40,
  },
});

export default SparePartsScreen;

