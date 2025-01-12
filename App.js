import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { app, auth } from './FireBase/firebase.config';
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
import Authentication from './components/Authentication';

// Import all screens
//import ScanOrLoginScreen from "./screens/ScanBeforeLogin";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import BrowseScreen from "./screens/Browse";
import AsianProducts from "./screens/BrowseAsianProducts";
import ProfessionalProducts from "./screens/BrowseProfessionalProducts";
import SpareParts from "./screens/BrowseSpareParts";
import ProductDetails from "./screens/ProductDetails";
import ServiceForm from "./screens/ServiceForm";
import EquipmentSales from "./screens/EquipmentSales";
import TechnicalSupport from "./screens/TechnicalSupport";
import HomeQR from "./screens/HomeQR";
import ProductInfo from "./screens/BeforeProductDetails";
import SparePartsScreen from "./screens/SparePart";
import WarrantyInformation from "./screens/WarrantyInformation";
import MyProfileScreen from "./screens/MyProfile";
import EditPictureScreen from "./screens/EditPictureScreen";
import AccountInformationScreen from "./screens/AccountInformationScreen";
import EditPersonalDetailsScreen from "./screens/EditPersonalDetailsScreen";
import WarrantyAndProductsScreen from "./screens/WarrantyAndProductsScreen";
import HelpAndSupportScreen from "./screens/HelpAndSupportScreen";
import FAQsScreen from "./screens/FAQsScreen";
import ChatbotScreen from "./screens/ChatBotScreen";
import ChatWithBot from "./screens/ChatWithBot";
import WebScreen from "./components/WebScreen";
import DataManagement from './screens/DataManagement';

import BottomNavBar from "./components/BottomNavBar";
import ChangePasswordScreen from './screens/ChangePassword';

const Stack = createStackNavigator();

const ScreenWithNavBar = ({ children, navigation }) => (
  <View style={{ flex: 1 }}>
    {children}
    <BottomNavBar navigation={navigation} />
  </View>
);

const withNavBar = (Component) => (props) => (
  <ScreenWithNavBar navigation={props.navigation}>
    <Component {...props} />
  </ScreenWithNavBar>
);

export default function App() {
  useEffect(() => {
    console.log("Firebase initialized");
  }, []);


  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={Authentication} />
        
        
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="BeforeProductDetails" component={ProductInfo} />
          <Stack.Screen name="Home" component={withNavBar(HomeScreen)} />
          <Stack.Screen name="Browse" component={withNavBar(BrowseScreen)} />
          <Stack.Screen name="AsianProducts" component={withNavBar(AsianProducts)} />
          <Stack.Screen name="ProfessionalProducts" component={withNavBar(ProfessionalProducts)} />
          <Stack.Screen name="SpareParts" component={withNavBar(SpareParts)} />
          <Stack.Screen name="ProductDetails" component={withNavBar(ProductDetails)} />
          <Stack.Screen name="ServiceForm" component={withNavBar(ServiceForm)} />
          <Stack.Screen name="EquipmentSales" component={withNavBar(EquipmentSales)} />
          <Stack.Screen name="TechnicalSupport" component={withNavBar(TechnicalSupport)} />
          <Stack.Screen name="HomeQR" component={withNavBar(HomeQR)} />
          <Stack.Screen name="ChatBot" component={withNavBar(ChatbotScreen)} />
          <Stack.Screen name="ChatWithBot" component={withNavBar(ChatWithBot)} />
          <Stack.Screen name="MyProfile" component={withNavBar(MyProfileScreen)} />
          <Stack.Screen name="EditPicture" component={withNavBar(EditPictureScreen)} />
          <Stack.Screen name="AccountInformation" component={withNavBar(AccountInformationScreen)} />
          <Stack.Screen name="EditPersonalDetails" component={withNavBar(EditPersonalDetailsScreen)} />
          <Stack.Screen name="ChangePassword" component={withNavBar(ChangePasswordScreen)} />
          <Stack.Screen name="WarrantyAndProducts" component={withNavBar(WarrantyAndProductsScreen)} />
          <Stack.Screen name="HelpAndSupport" component={withNavBar(HelpAndSupportScreen)} />
          <Stack.Screen name="FAQs" component={withNavBar(FAQsScreen)} />
          <Stack.Screen name="WarrantyInformation" component={withNavBar(WarrantyInformation)} />
          <Stack.Screen name="SparePart" component={withNavBar(SparePartsScreen)} />
          <Stack.Screen name="AboutUs" component={WebScreen} initialParams={{ uri: "https://luus.com.au/about-us/" }} />
          <Stack.Screen name="DuckOven" component={WebScreen} initialParams={{ uri: "https://luus.com.au/range/asian/duck-ovens/" }} />
          <Stack.Screen name="NoodleCooker" component={WebScreen} initialParams={{ uri: "https://luus.com.au/range/asian/noodle-cookers/" }} />
          <Stack.Screen name="OvenRanges" component={WebScreen} initialParams={{ uri: "https://luus.com.au/range/professional/oven-ranges/" }} />
          <Stack.Screen name="PastaCooker" component={WebScreen} initialParams={{ uri: "https://luus.com.au/range/asian/pasta-cookers/" }} />
          <Stack.Screen name="DataManagement" component={withNavBar(DataManagement)} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

