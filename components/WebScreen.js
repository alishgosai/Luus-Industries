import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import BottomNavBar from "./BottomNavBar"; 
export default function WebScreen({ route, navigation }) {
  const { uri } = route.params; // ro retrive the link to open the screeen 

  return (
    <SafeAreaView style={styles.container}>
      {/* WebView Content */}
      <View style={styles.webviewContainer}>
        <WebView source={{ uri }} style={styles.webview} />
      </View>

      {/* Bottom Navigation Bar */}
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
