import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";

// Login and Register Pages
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
import MyProfileScreen from "./screens/MyProfile";
import EditPictureScreen from "./screens/EditPictureScreen";

import AccountInformationScreen from "./screens/AccountInformationScreen";
import EditPersonalDetailsScreen from "./screens/EditPersonalDetailsScreen";

import WarrantyAndProductsScreen from "./screens/WarrantyAndProductsScreen";
import HelpAndSupportScreen from "./screens/HelpAndSupportScreen";
import FAQsScreen from "./screens/FAQsScreen";

// Components
import BottomNavBar from "./components/BottomNavBar";
import ChatbotScreen from "./screens/ChatBotScreen";
import ChatWithBot from "./screens/ChatWithBot";

// Stack Navigator
const Stack = createStackNavigator();

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
          initialRouteName="ChatWithBot"
          screenOptions={{ headerShown: false }}
        >
          {/* Authentication Screens */}
          <Stack.Screen name="ScanOrLoginScreen" component={ScanOrLoginScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

          {/* Main Application Screens */}
          <Stack.Screen
            name="Home"
            component={(props) => <ScreenWithNavBar Component={HomeScreen} {...props} />}
          />
          <Stack.Screen
            name="Browse"
            component={(props) => <ScreenWithNavBar Component={BrowseScreen} {...props} />}
          />
          <Stack.Screen
            name="AsianProducts"
            component={(props) => <ScreenWithNavBar Component={AsianProducts} {...props} />}
          />
          <Stack.Screen
            name="ProfessionalProducts"
            component={(props) => <ScreenWithNavBar Component={ProfessionalProducts} {...props} />}
          />
          <Stack.Screen
            name="SpareParts"
            component={(props) => <ScreenWithNavBar Component={SpareParts} {...props} />}
          />
          <Stack.Screen
            name="ProductDetails"
            component={(props) => <ScreenWithNavBar Component={ProductDetails} {...props} />}
          />
          <Stack.Screen
            name="ServiceForm"
            component={(props) => <ScreenWithNavBar Component={ServiceForm} {...props} />}
          />

<Stack.Screen
            name="ChatBot"
            component={(props) => <ScreenWithNavBar Component={ChatbotScreen} {...props} />}
          />

<Stack.Screen
            name="ChatWithBot"
            component={(props) => <ScreenWithNavBar Component={ChatWithBot} {...props} />}
          />

          
          {/* Account and Settings */}
          <Stack.Screen
            name="MyProfile"
            component={(props) => <ScreenWithNavBar Component={MyProfileScreen} {...props} />}
          />

          <Stack.Screen
          name="EditPicture"
          component={(props) => <ScreenWithNavBar Component={EditPictureScreen} {...props} />}
          />

          <Stack.Screen
            name="AccountInformation"
            component={(props) => <ScreenWithNavBar Component={AccountInformationScreen} {...props} />}
          />
          <Stack.Screen
            name="EditPersonalDetails"
            component={(props) => <ScreenWithNavBar Component={EditPersonalDetailsScreen} {...props} />}
          />

          <Stack.Screen
            name="WarrantyAndProducts"
            component={(props) => <ScreenWithNavBar Component={WarrantyAndProductsScreen} {...props} />}
          />
          <Stack.Screen
            name="HelpAndSupport"
            component={(props) => <ScreenWithNavBar Component={HelpAndSupportScreen} {...props} />}
          />
          <Stack.Screen
            name="FAQs"
            component={(props) => <ScreenWithNavBar Component={FAQsScreen} {...props} />}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

