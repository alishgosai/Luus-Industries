// components/WebScreen.js
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import BottomNavBar from "./BottomNavBar"; // Import BottomNavBar component

export default function WebScreen({ route, navigation }) {
  const { uri } = route.params; // Retrieve the URI passed to this screen

  return (
    <SafeAreaView style={styles.container}>
      {/* WebView Content */}
      <View style={styles.webviewContainer}>
        <WebView source={{ uri }} style={styles.webview} />
      </View>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.navbarContainer}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webviewContainer: {
    flex: 1,
    paddingBottom: 70, // Space for BottomNavBar
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
