import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ navigation }) {
  return (
    <View style={styles.navBar}>
      {/* Home Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#ffffff" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Browse Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Browse')}>
        <Ionicons name="search-outline" size={24} color="#ffffff" />
        <Text style={styles.navText}>Browse</Text>
      </TouchableOpacity>

      {/* Scan Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="scan-outline" size={24} color="#ffffff" />
        <Text style={styles.navText}>Scan</Text>
      </TouchableOpacity>

      {/* Chat Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>

      {/* Account Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="person-outline" size={24} color="#ffffff" />
        <Text style={styles.navText}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute', // Fix to the bottom of the screen
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0078D7', // Blue background for the navbar
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#005bb5', // Slightly darker blue for the border
    zIndex: 10, // Ensure the navbar stays above other content
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Each item takes equal space
  },
  navText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 4,
  },
});
