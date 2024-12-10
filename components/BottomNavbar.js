import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";

export default function BottomNavBar({ navigation }) {
  const state = useNavigationState((state) => state);

  const isActive = (routeName) => {
    return state?.routes[state.index]?.name === routeName;
  };

  return (
    <View style={styles.navBar}>
      {/* Home Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="home-outline"
          size={24}
          color={isActive("Home") ? "#00bfff" : "#ffffff"}
        />
        <Text style={[styles.navText, isActive("Home") && styles.activeNavText]}>
          Home
        </Text>
      </TouchableOpacity>


      {/* Browse Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Browse")}
      >
        <Ionicons
          name="search-outline"
          size={24}
          color={isActive("Browse") ? "#00bfff" : "#ffffff"}
        />
        <Text style={[styles.navText, isActive("Browse") && styles.activeNavText]}>
          Browse
        </Text>
      </TouchableOpacity>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("ScanAfterLogin")}
      >
        <Ionicons
          name="scan-outline"
          size={24}
          color={isActive("ScanAfterLogin") ? "#00bfff" : "#ffffff"}
        />
        <Text style={[styles.navText, isActive("ScanAfterLogin") && styles.activeNavText]}>
          Scan
        </Text>
      </TouchableOpacity>

      {/* Chat Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Chat")}
      >
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color={isActive("Chat") ? "#00bfff" : "#ffffff"}
        />
        <Text style={[styles.navText, isActive("Chat") && styles.activeNavText]}>
          Chat
        </Text>
      </TouchableOpacity>


      {/* Account Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Register")}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={isActive("Register") ? "#00bfff" : "#ffffff"}
        />
        <Text style={[styles.navText, isActive("Register") && styles.activeNavText]}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#0078D7", // Blue background
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#005bb5", // Slightly darker blue for border
    zIndex: 10,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  navText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    fontWeight: "bold",
    color: "#00bfff", // Highlighted color for active tab
  },
});

