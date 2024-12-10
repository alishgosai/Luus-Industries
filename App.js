import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

// Login and Register Pages
import ScannerBeforeLoginScreen from "./screens/ScanBeforeLogin";
import ScanOrLoginScreen from "./screens/ScanBeforeLogin";
import ScanScreen from "./screens/ScanScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetCodeScreen from "./screens/ResetCodeScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";


// Main Pages
import HomeScreen from "./screens/HomeScreen";
import BrowseScreen from "./screens/Browse";
import AsianProducts from "./screens/BrowseAsianProducts";
import ProfessionalProducts from "./screens/BrowseProfessionalProducts";
import SpareParts from "./screens/BrowseSpareParts";

// Products Details
import ProductDetails from "./screens/ProductDetails";

// Components
import BottomNavBar from "./components/BottomNavBar";

// Stack Navigator
const Stack = createStackNavigator();

function ScreenWithNavBar({ Component, navigation, ...props }) {
  return (
    <SafeAreaProvider>

      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Component {...props} navigation={navigation} />
      <BottomNavBar navigation={navigation} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ProductDetails" // Default screen this is the first screeen///////////////////////////////////////
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication Screens */}
        <Stack.Screen name="ScanOrLoginScreen" component={ScanOrLoginScreen} />
        <Stack.Screen name="ScanBeforeLogin" component={ScannerBeforeLoginScreen}/>
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

        {/* Main Application Screens */}
        <Stack.Screen
          name="Home"
          children={(props) => <ScreenWithNavBar Component={HomeScreen} {...props} />}
        />
        <Stack.Screen
          name="Browse"
          children={(props) => <ScreenWithNavBar Component={BrowseScreen} {...props} />}
        />
        <Stack.Screen
          name="AsianProducts"
          children={(props) => <ScreenWithNavBar Component={AsianProducts} {...props} />}
        />
        <Stack.Screen
          name="ProfessionalProducts"
          children={(props) => <ScreenWithNavBar Component={ProfessionalProducts} {...props} />}
        />
        <Stack.Screen
          name="SpareParts"
          children={(props) => <ScreenWithNavBar Component={SpareParts} {...props} />}
        />
        <Stack.Screen
          name="ProductDetails"
          children={(props) => <ScreenWithNavBar Component={ProductDetails} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
