import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function BrowseSpareParts({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* WebView Content */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: "https://luus.com.au/spareparts/" }}
          style={styles.webview}
        />
      </View>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Consistent background color
  },
  webviewContainer: {
    flex: 1,
    paddingBottom: 70, // Space for BottomNavBar
  },
});
