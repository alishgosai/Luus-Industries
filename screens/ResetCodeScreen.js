// screens/ResetCodeScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ResetCodeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Reset Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your reset code"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Code submitted!')}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Forgot Password</Text>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00f',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  link: { color: '#00f', marginTop: 10 },
});
