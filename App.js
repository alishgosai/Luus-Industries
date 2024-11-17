import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Stack = createStackNavigator();

function RegisterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/luus-logo.png')} style={styles.logoImage} />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity>
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabTextActive}>Register</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#fff" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#fff" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#fff" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#fff" secureTextEntry />
      <Button title="Sign Up" onPress={() => {}} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 10,
  },
  tabTextActive: {
    fontSize: 18,
    color: '#00f',
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff',
  },
});
