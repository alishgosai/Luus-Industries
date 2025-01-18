import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import BottomNavBar from "../components/BottomNavBar";

export default function ProfessionalProducts({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* WebView Content */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: "https://luus.com.au/range/professional/" }}
          style={styles.webview}
        />
      </View>

      {/* Fixed Bottom Navigation Bar */}
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
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
