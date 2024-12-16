import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";

// Screens and Components
import ScanOrLoginScreen from "./screens/ScanBeforeLogin";
import ScanScreen from "./screens/ScanScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetCodeScreen from "./screens/ResetCodeScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";

import HomeScreen from "./screens/HomeScreen";
import BrowseScreen from "./screens/Browse";
import ProductDetails from "./screens/ProductDetails";

import ServiceForm from "./screens/ServiceForm";

import MyProfileScreen from "./screens/MyProfile";
import EditPictureScreen from "./screens/EditPictureScreen";
import AccountInformationScreen from "./screens/AccountInformationScreen";
import EditPersonalDetailsScreen from "./screens/EditPersonalDetailsScreen";
import WarrantyAndProductsScreen from "./screens/WarrantyAndProductsScreen";
import HelpAndSupportScreen from "./screens/HelpAndSupportScreen";
import FAQsScreen from "./screens/FAQsScreen";

import BottomNavBar from "./components/BottomNavBar";
import WebScreen from "./components/WebScreen"; // Reusable WebView Component

// Stack Navigator
const Stack = createStackNavigator();

// Screen with BottomNavBar Wrapper
const ScreenWithNavBar = ({ Component, ...props }) => (
  <View style={{ flex: 1 }}>
    <Component {...props} />
    <BottomNavBar navigation={props.navigation} />
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Stack.Navigator
          initialRouteName="ScanOrLoginScreen" // Set Home as initial screen
          screenOptions={{ headerShown: false }}
        >
          {/* Authentication Screens */}
          <Stack.Screen
            name="ScanOrLoginScreen"
            component={ScanOrLoginScreen}
          />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

          {/* Main Application Screens */}
          <Stack.Screen
            name="Home"
            component={(props) => (
              <ScreenWithNavBar Component={HomeScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="Browse"
            component={(props) => (
              <ScreenWithNavBar Component={BrowseScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="ProductDetails"
            component={(props) => (
              <ScreenWithNavBar Component={ProductDetails} {...props} />
            )}
          />
          <Stack.Screen
            name="ServiceForm"
            component={(props) => (
              <ScreenWithNavBar Component={ServiceForm} {...props} />
            )}
          />

          {/* WebScreen Reusable Screens */}
          <Stack.Screen
            name="AsianProducts"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/asian/" }}
          />
          <Stack.Screen
            name="ProfessionalProducts"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/professional/" }}
          />
          <Stack.Screen
            name="SpareParts"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/spareparts/" }}
          />

          {/* Account and Settings */}
          <Stack.Screen
            name="MyProfile"
            component={(props) => (
              <ScreenWithNavBar Component={MyProfileScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="EditPicture"
            component={(props) => (
              <ScreenWithNavBar Component={EditPictureScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="AccountInformation"
            component={(props) => (
              <ScreenWithNavBar
                Component={AccountInformationScreen}
                {...props}
              />
            )}
          />
          <Stack.Screen
            name="EditPersonalDetails"
            component={(props) => (
              <ScreenWithNavBar
                Component={EditPersonalDetailsScreen}
                {...props}
              />
            )}
          />
          <Stack.Screen
            name="WarrantyAndProducts"
            component={(props) => (
              <ScreenWithNavBar
                Component={WarrantyAndProductsScreen}
                {...props}
              />
            )}
          />
          <Stack.Screen
            name="HelpAndSupport"
            component={(props) => (
              <ScreenWithNavBar Component={HelpAndSupportScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="FAQs"
            component={(props) => (
              <ScreenWithNavBar Component={FAQsScreen} {...props} />
            )}
          />

          {/* EXternal webview screens */}
          {/* external links for home page. */}
          <Stack.Screen
            name="AboutUs"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/about-us/" }}
          />
          <Stack.Screen
            name="DuckOven"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/asian/duck-ovens/" }}
          />
          <Stack.Screen
            name="NoodleCooker"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/asian/noodle-cookers/" }}
          />
          <Stack.Screen
            name="OvenRanges"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/professional/oven-ranges/" }}
          />
          <Stack.Screen
            name="PastaCooker"
            component={WebScreen}
            initialParams={{ uri: "https://luus.com.au/range/asian/pasta-cookers/" }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
