import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ScanPage from "./screens/ScanPage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetCodeScreen from "./screens/ResetCodeScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";

// Home page
import HomeScreen from "./screens/HomeScreen";

// Browse Pages
import AsianProducts from "./screens/BrowseAsianProducts";
import ProfessionalProducts from "./screens/BrowseProfessionalProducts";
import SpareParts from "./screens/SpareParts";

import ScannerScreen from "./screens/ScanBeforeLogin";

// import BrowseScreen from './screens/BrowseScreen';
// import ScanScreen from './screens/ScanScreen';
// import ChatScreen from './screens/ChatScreen';
// import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ScanLogin"
        screenOptions={{ headerShown: false }}
      >
        {/* Scan and Login/Register Pages */}
        <Stack.Screen name="ScanLogin" component={ScanPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Forget and Reset Password pages */}
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

        {/* Home Page */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Browse Pages */}
        <Stack.Screen name="AsianProducts" component={AsianProducts} />
        <Stack.Screen
          name="ProfessionalProducts"
          component={ProfessionalProducts}
        />
        <Stack.Screen name="BrowseSpareParts" component={SpareParts} />

        {/* Add comments here guys like this what pages which pages n stuffs. */}
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
