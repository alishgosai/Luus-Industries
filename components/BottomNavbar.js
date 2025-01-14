import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Keyboard, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";

export default function BottomNavBar({ navigation }) {
  const state = useNavigationState((state) => state);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const isActive = (routeName) => {
    return state?.routes[state.index]?.name === routeName;
  };

  if (isKeyboardVisible) {
    return null;
  }

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
          color={isActive("Home") ? "#ffffff" : "#111111"}
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
          color={isActive("Browse") ? "#ffffff" : "#111111"}
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
          color={isActive("HomeQR") ? "#ffffff" : "#111111"}
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
          isActive("ChatWithBot") && styles.activeNavItem,
        ]}
        onPress={() => navigation.navigate("ChatWithBot")}
        accessibilityLabel="Chat"
      >
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color={isActive("ChatWithBot") ? "#ffffff" : "#111111"}
        />
        <Text
          style={[
            styles.navText,
            isActive("ChatWithBot") && styles.activeNavText,
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
          color={isActive("MyProfile") ? "#ffffff" : "#111111"}
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#87CEEB',
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0,
    position: 'relative', // Changed from absolute to relative
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    margin: 5,
  },
  activeNavItem: {
    backgroundColor: "#00aaff",
  },
  navText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  activeNavText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});

