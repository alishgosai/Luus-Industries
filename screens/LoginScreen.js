import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/150x50.png' }} style={styles.logo} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#fff" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#fff" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => alert('Logged in')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>New User? Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 150, height: 50, marginBottom: 30 },
  input: { width: '100%', height: 40, borderColor: '#fff', borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, color: '#fff' },
  button: { backgroundColor: '#00f', padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  link: { color: '#00f', marginTop: 10 },
});
