import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import BottomNavBar from "../components/BottomNavBar";

export default function SpareParts({ navigation }) {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://luus.com.au/spareparts/" }}
        style={styles.webview}
      />
      <BottomNavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    marginBottom: 70, // Space for BottomNavBar
  },
});
