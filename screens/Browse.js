import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BrowseScreen({ navigation }) {
  const products = [
    {
      title: "Asian Products",
      description: "Click for more details.",
      route: "AsianProducts",
      icon: require("../assets/images/orange-theme.png"),
    },
    {
      title: "Professional Products",
      description: "Click for more details.",
      route: "ProfessionalProducts",
      icon: require("../assets/images/white-theme.png"),
    },
    {
      title: "Spare Parts",
      description: "Click for more details.",
      route: "SpareParts",
      icon: require("../assets/images/blue-theme.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Browse Products</Text>
          
        </View>

        {/* Scrollable Product List */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
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
              <Ionicons name="chevron-forward" size={24} color="#00aaff" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#87CEEB",
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  searchButton: {
    marginLeft: 8,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
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
    marginBottom: 5,
  },
  productDescription: {
    color: "#aaa",
    fontSize: 14,
  },
});

