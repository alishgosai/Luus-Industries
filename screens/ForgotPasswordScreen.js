import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Reset link sent!')}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: { fontSize: 24, color: '#fff', marginBottom: 20 },
  input: { width: '100%', borderColor: '#fff', borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, color: '#fff', height: 40 },
  button: { backgroundColor: '#00f', padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  linkText: { color: '#00f', marginTop: 10 },
});
