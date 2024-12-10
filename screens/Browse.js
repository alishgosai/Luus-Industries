import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import BottomNavBar from "../components/BottomNavBar";

export default function BrowseScreen({ navigation }) {
  const products = [
    {
      title: "Asian Products",
      description: "Product description.",
      route: "AsianProducts",
      icon: require("../assets/images/orange-theme.png"),
    },
    {
      title: "Professional Products",
      description: "Product description.",
      route: "ProfessionalProducts",
      icon: require("../assets/images/white-theme.png"),
    },
    {
      title: "Spare Parts",
      description: "Product description.",
      route: "SpareParts",
      icon: require("../assets/images/blue-theme.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Browse Products</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Product List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() => navigation.navigate(product.route)}
          >
            <Image source={product.icon} style={styles.productIcon} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </View>
            <Image
              source={require("../assets/images/external-link.png")} // Replace with your icon
              style={styles.externalIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  iconButton: {
    padding: 5,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 15,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  productIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    color: "#aaa",
    fontSize: 14,
  },
  externalIcon: {
    width: 24,
    height: 24,
    tintColor: "#00aaff",
  },
});
