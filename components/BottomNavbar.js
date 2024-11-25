import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this library is installed

export default function BottomNavBar({ navigation }) {
  return (
    <View style={styles.navBar}>
      {/* Home */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#fff" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Browse */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Browse')}>
        <Ionicons name="search" size={24} color="#fff" />
        <Text style={styles.navText}>Browse</Text>
      </TouchableOpacity>

      {/* Scan */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="scan" size={24} color="#fff" />
        <Text style={styles.navText}>Scan</Text>
      </TouchableOpacity>

      {/* Chat */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubble" size={24} color="#fff" />
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings" size={24} color="#fff" />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#000', // Background color for the navigation bar
    borderTopWidth: 1,
    borderTopColor: '#444', // Border at the top of the navbar
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
