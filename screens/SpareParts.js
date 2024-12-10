import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const SparePartsScreen = () => {
  const parts = [
    {
      id: '1',
      title: 'R134 Gas Appliance',
      partNo: '107M73',
      compatibility: 'D70, NC, FC, RL, RS, SEM, MA, WF',
      image: require('./assets/part1.png'),
    },
    {
      id: '2',
      title: 'Electrode Alpha C/W',
      partNo: '107250',
      compatibility: 'D5, XTE, RS, YC',
      image: require('./assets/part2.png'),
    },
    // Add more parts as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spare Parts</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search here...</Text>
        </View>
      </View>

      {/* Parts List */}
      <ScrollView style={styles.scrollView}>
        {parts.map((part) => (
          <View key={part.id} style={styles.partCard}>
            <Image source={part.image} style={styles.partImage} />
            <View style={styles.partInfo}>
              <Text style={styles.partTitle}>{part.title}</Text>
              <Text style={styles.partDetails}>Part #: {part.partNo}</Text>
              <Text style={styles.compatibility}>
                Compatibility: {part.compatibility}
              </Text>
              <TouchableOpacity style={styles.purchaseButton}>
                <Text style={styles.purchaseButtonText}>Purchase on Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  searchText: {
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  partCard: {
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 12,
  },
  partImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  partInfo: {
    flex: 1,
    marginLeft: 12,
  },
  partTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  partDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  compatibility: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  purchaseButton: {
    backgroundColor: '#e6f3ff',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#0066cc',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});

export default SparePartsScreen;