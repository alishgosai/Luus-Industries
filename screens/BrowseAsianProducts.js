import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function AsianProducts({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: "https://luus.com.au/range/asian/" }}
          style={styles.webview}
        />
      </View>

   
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Consistent background
  },
  webviewContainer: {
    flex: 1,
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
