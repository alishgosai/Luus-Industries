import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

// Login and Register Pages
import ScanPage from "./screens/ScanPage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetCodeScreen from "./screens/ResetCodeScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";

// Main App Screens
import HomeScreen from './screens/HomeScreen';
import AccountInformationScreen from './screens/AccountInformationScreen';
import WarrantyAndProductsScreen from './screens/WarrantyAndProductsScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import BrowseScreen from './screens/BrowseScreen';
import ScanScreen from './screens/ScanScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ScanLogin"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#121212' },
          }}
        >
          {/* Scan and Login/Register Pages */}
          <Stack.Screen name="ScanLogin" component={ScanPage} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Forgot and Reset Password Pages */}
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

          {/* Main App Screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AccountInformationScreen" component={AccountInformationScreen} />
          <Stack.Screen name="WarrantyAndProductsScreen" component={WarrantyAndProductsScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="Browse" component={BrowseScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}