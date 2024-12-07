import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context"; // For SafeArea
import { StatusBar } from "react-native";

// Login and Register Pages
import ScanPage from "./screens/ScanPage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetCodeScreen from "./screens/ResetCodeScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";

// Home Page
import HomeScreen from "./screens/HomeScreen";

// Browse Pages
import BrowseScreen from "./screens/Browse";
import AsianProducts from "./screens/BrowseAsianProducts";
import ProfessionalProducts from "./screens/BrowseProfessionalProducts";
import SpareParts from "./screens/BrowseSpareParts";

// Scan Page
import ScannerScreen from "./screens/ScanBeforeLogin";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Global Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Browse" // Set your default screen
          screenOptions={{ headerShown: false }}
        >
          {/* Scan and Login/Register Pages */}
          <Stack.Screen name="ScanLogin" component={ScanPage} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Forgot and Reset Password Pages */}
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

          {/* Home Page */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Browse Pages */}
          <Stack.Screen name="Browse" component={BrowseScreen} />
          <Stack.Screen name="AsianProducts" component={AsianProducts} />
          <Stack.Screen
            name="ProfessionalProducts"
            component={ProfessionalProducts}
          />
          <Stack.Screen name="SpareParts" component={SpareParts} />

          {/* Scanner Page */}
          <Stack.Screen name="Scanner" component={ScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
