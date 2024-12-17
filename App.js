import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";

// Authentication Screens
import ScanOrLoginScreen from "./screens/ScanBeforeLogin";
import ScanScreen from "./screens/ScanScreen";
import LoginScreen from "./screens/LoginScreen";
// ..............Not used these screens in app but might need later................... 

// import RegisterScreen from "./screens/RegisterScreen";
// import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
// import ResetCodeScreen from "./screens/ResetCodeScreen";
// import NewPasswordScreen from "./screens/NewPasswordScreen";

// Main Application Screens
import HomeScreen from "./screens/HomeScreen";
import BrowseScreen from "./screens/Browse";
// .............Browse screen parts..............
import AsianProducts from "./screens/BrowseAsianProducts";
import ProfessionalProducts from "./screens/BrowseProfessionalProducts";
import SpareParts from "./screens/BrowseSpareParts";
import ProductDetails from "./screens/ProductDetails";
import ServiceForm from "./screens/ServiceForm";
import EquipmentSales from "./screens/EquipmentSales";
import TechnicalSupport from "./screens/TechnicalSupport";

// QR Scan Screens
import QRScanner from "./screens/QRScanner";
import QRCodeScanner from "./screens/QR";

// Product Info
import ProductInfo from "./screens/BeforeProductDetails";

// Account and Settings Screens
import MyProfileScreen from "./screens/MyProfile";
import EditPictureScreen from "./screens/EditPictureScreen";
import AccountInformationScreen from "./screens/AccountInformationScreen";
import EditPersonalDetailsScreen from "./screens/EditPersonalDetailsScreen";
import WarrantyAndProductsScreen from "./screens/WarrantyAndProductsScreen";
import HelpAndSupportScreen from "./screens/HelpAndSupportScreen";
import FAQsScreen from "./screens/FAQsScreen";

// Chatbot Screens
import ChatbotScreen from "./screens/ChatBotScreen";
import ChatWithBot from "./screens/ChatWithBot";

// Additional Web Screens from Your Code
import WebScreen from "./components/WebScreen";

// Components
import BottomNavBar from "./components/BottomNavBar";

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
          initialRouteName="ScanOrLoginScreen" // Choose initial screen based on your preference
          screenOptions={{ headerShown: false }}
        >
          {/* Authentication Screens */}
          <Stack.Screen
            name="ScanOrLoginScreen"
            component={ScanOrLoginScreen}
          />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* ...............Might need these screens later...................... */}
          {/* <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} /> */}

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
            name="AsianProducts"
            component={(props) => (
              <ScreenWithNavBar Component={AsianProducts} {...props} />
            )}
          />
          <Stack.Screen
            name="ProfessionalProducts"
            component={(props) => (
              <ScreenWithNavBar Component={ProfessionalProducts} {...props} />
            )}
          />
          <Stack.Screen
            name="SpareParts"
            component={(props) => (
              <ScreenWithNavBar Component={SpareParts} {...props} />
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
          <Stack.Screen
            name="EquipmentSales"
            component={(props) => (
              <ScreenWithNavBar Component={EquipmentSales} {...props} />
            )}
          />
          <Stack.Screen
            name="TechnicalSupport"
            component={(props) => (
              <ScreenWithNavBar Component={TechnicalSupport} {...props} />
            )}
          />


          {/* QR Scan Screens */}
          <Stack.Screen
            name="QR"
            component={(props) => (
              <ScreenWithNavBar Component={QRCodeScanner} {...props} />
            )}
          />
          <Stack.Screen
            name="QRScanner"
            component={(props) => (
              <ScreenWithNavBar Component={QRScanner} {...props} />
            )}
          />

          {/* Product Info */}
          <Stack.Screen
            name="BeforeProductDetails"
            component={(props) => (
              <ScreenWithNavBar Component={ProductInfo} {...props} />
            )}
          />

          {/* Chatbot Screens */}
          <Stack.Screen
            name="ChatBot"
            component={(props) => (
              <ScreenWithNavBar Component={ChatbotScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="ChatWithBot"
            component={(props) => (
              <ScreenWithNavBar Component={ChatWithBot} {...props} />
            )}
          />

          {/* Account and Settings Screens */}
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
              <ScreenWithNavBar Component={AccountInformationScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="EditPersonalDetails"
            component={(props) => (
              <ScreenWithNavBar Component={EditPersonalDetailsScreen} {...props} />
            )}
          />
          <Stack.Screen
            name="WarrantyAndProducts"
            component={(props) => (
              <ScreenWithNavBar Component={WarrantyAndProductsScreen} {...props} />
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

          {/* External WebView Screens from Your Code */}
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
