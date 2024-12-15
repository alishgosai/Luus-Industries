import React from "react";
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function AsianProducts({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <WebView
          source={{ uri: "https://luus.com.au/range/asian/" }}
          style={styles.webview}
          contentInset={{ bottom: 70 }}
          automaticallyAdjustContentInsets={false}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

