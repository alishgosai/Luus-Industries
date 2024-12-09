import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

// Login and Register Pages
// import ScannerBeforeLoginScreen from "./screens/ScannerBeforeLogin";
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

//Service Form
import ServiceForm from "./screens/ServiceForm";

// Account Information
import AccountInformation from "./screens/AccountInformationScreen";
import WarrantyAndProductsScreen from "./screens/WarrantyAndProductsScreen";

// Components
import BottomNavBar from "./components/BottomNavBar";
import AccountInformationScreen from "./screens/AccountInformationScreen";


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
        initialRouteName="AccountInformation"
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication Screens */}
        <Stack.Screen name="ScanOrLoginScreen" component={ScanOrLoginScreen} />
        {/* <Stack.Screen name="ScanBeforeLogin" component={ScannerBeforeLoginScreen} /> */}
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
        <Stack.Screen
          name="ServiceForm"
          children={(props) => <ScreenWithNavBar Component={ServiceForm} {...props} />}
        />
        {/* Account and settings */}
        <Stack.Screen
          name="AccountInformation"
          children={(props) => <ScreenWithNavBar Component={AccountInformationScreen} {...props} />}
        />
        <Stack.Screen
          name="WarrantyAndProducts"
          children={(props) => <ScreenWithNavBar Component={WarrantyAndProductsScreen} {...props} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

