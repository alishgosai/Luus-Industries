import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function ProfessionalProducts() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://luus.com.au/range/professional/" }}
        style={styles.webview}
        scalesPageToFit={true}
        scrollEnabled={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        injectedJavaScript={`
          document.body.style.backgroundColor = 'black';
          document.querySelector('.bottom-nav-bar')?.remove();
          true;
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  }
});

