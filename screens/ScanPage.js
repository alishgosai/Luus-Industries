import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScanPage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* Scan Icon and Button */}
      <TouchableOpacity style={styles.scanButton}>
        <Ionicons name="scan" size={50} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.labelButton}>
        <Text style={styles.labelText}>Scan Products</Text>
      </TouchableOpacity>

      {/* Login Options */}
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.newUserText}>
        New User?{' '}
        <Text
          style={styles.createAccountText}
          onPress={() => navigation.navigate('Register')}
        >
          Create Account
        </Text>
      </Text>

      {/* Bottom Wave Image */}
      <Image source={require('../assets/images/blue-wave.png')} style={styles.bottomImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  scanButton: {
    backgroundColor: '#0056b3', // Blue background for the scan button
    padding: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelButton: {
    paddingHorizontal: 20, // Adds horizontal padding
    paddingVertical: 10, // Adds vertical padding
    backgroundColor: '#0073e6', // Button background color
    borderRadius: 5, // Rounded corners
    alignSelf: 'center', // Dynamically sizes based on text
    marginBottom: 20,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  orText: {
    color: '#aaa',
    fontSize: 16,
    marginVertical: 10,
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#0073e6',
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  newUserText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
  },
  createAccountText: {
    color: '#0073e6',
    fontWeight: 'bold',
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%', // Full width
    height: undefined, // Allows for dynamic height based on aspect ratio
    aspectRatio: 3 / 1, // Adjust based on your actual image aspect ratio
    resizeMode: 'contain', // Ensures the full image is displayed
  },
});
