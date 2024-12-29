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
        style={[
          styles.navItem,
          isActive("Home") && styles.activeNavItem,
        ]}
        onPress={() => navigation.navigate("Home")}
        accessibilityLabel="Home"
      >
        <Ionicons
          name="home-outline"
          size={24}
          color={isActive("Home") ? "#ffffff" : "#111111"} // Icon color remains white
        />
        <Text
          style={[
            styles.navText,
            isActive("Home") && styles.activeNavText,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Browse Button */}
      <TouchableOpacity
        style={[
          styles.navItem,
          isActive("Browse") && styles.activeNavItem,
        ]}
        onPress={() => navigation.navigate("Browse")}
        accessibilityLabel="Browse"
      >
        <Ionicons
          name="search-outline"
          size={24}
          color={isActive("Browse") ? "#ffffff" : "#111111"} // Icon color remains white
        />
        <Text
          style={[
            styles.navText,
            isActive("Browse") && styles.activeNavText,
          ]}
        >
          Browse
        </Text>
      </TouchableOpacity>

      {/* Scan Button */}
      <TouchableOpacity
        style={[
          styles.navItem,
          isActive("HomeQR") && styles.activeNavItem,
        ]}
        onPress={() => navigation.navigate("HomeQR")}
        accessibilityLabel="Scan"
      >
        <Ionicons
          name="scan-outline"
          size={24}
          color={isActive("HomeQR") ? "#ffffff" : "#111111"} // Icon color remains white
        />
        <Text
          style={[
            styles.navText,
            isActive("HomeQR") && styles.activeNavText,
          ]}
        >
          Scan
        </Text>
      </TouchableOpacity>

            {/* Chat Button */}
<TouchableOpacity
  style={[
    styles.navItem,
    isActive("ChatBot") && styles.activeNavItem,
  ]}
  onPress={() => navigation.navigate("ChatBot")}
  accessibilityLabel="Chat"
>
  <Ionicons
    name="chatbubble-outline"
    size={24}
    color={isActive("ChatBot") ? "#ffffff" : "#111111"} // Icon color remains white'
   
  />
  <Text
    style={[
      styles.navText,
      isActive("ChatBot") && styles.activeNavText,
    ]}
  >
    Chat
  </Text>
</TouchableOpacity>


      {/* Account Button */}
      <TouchableOpacity
        style={[
          styles.navItem,
          isActive("MyProfile") && styles.activeNavItem,
        ]}
        onPress={() => navigation.navigate("MyProfile")}
        accessibilityLabel="Profile"
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={isActive("MyProfile") ?  "#ffffff" : "#111111"}
          
        />
        <Text
          style={[
            styles.navText,
            isActive("MyProfile") && styles.activeNavText,
          ]}
        >
          Profile
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
    backgroundColor: '#87CEEB', // Blue background
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
    paddingVertical: 10, // Added padding for better touch area
    borderRadius: 10, // Rounded corners
    margin: 5, // Space around each navItem
  },
  activeNavItem: {
    backgroundColor: "#00aaff", // Active background color matching the blue button
  },
  navText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  activeNavText: {
    fontWeight: "bold",
    color: "#ffffff", // Active text color set to white for contrast
  },
});
