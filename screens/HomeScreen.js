import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import BottomNavBar from "../components/BottomNavBar";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85; // For carousel cards with part of the next item visible
const IMAGE_WIDTH = width * 0.75; // For image carousel

export default function HomeScreen({ navigation }) {
  const cards = [
    {
      text: "Your kitchen is our vision. Housed within a purpose-built facility in Melbourne's West, Luus Industries are proudly committed to being the leading manufacturer and solutions provider of commercial catering equipment in Australia.",
      image: require("../assets/images/image19.png"),
    },
    {
      text: "Another vision for your kitchen. With enhanced facilities, we aim to redefine quality and efficiency for modern catering equipment.",
      image: require("../assets/images/image19-1.png"),
    },
  ];

  const ranges = [
    {
      title: "ASIAN RANGE",
      description:
        "We've been involved in Asian cuisine since birth! With that in mind, we hold Asian food, and the people who prepare it, close to our hearts.",
      buttonText: "Explore Asian Products",
      route: "AsianProducts",
    },
    {
      title: "PROFESSIONAL RANGE",
      description:
        "Built for experts, our professional range ensures efficiency, reliability, and top-notch performance for your culinary needs.",
      buttonText: "Explore Professional Products",
      route: "ProfessionalProducts",
    },
  ];

  const images = [
    require("../assets/images/image19.png"),
    require("../assets/images/image19-1.png"),
    require("../assets/images/image19.png"),
    require("../assets/images/image19-1.png"),
  ];

  const renderImageCarouselItem = ({ item }) => (
    <Image source={item} style={styles.imageCarouselItem} />
  );

  const handleImageCarouselChange = (direction) => {
    // Logic for next and previous image buttons
    if (direction === "next") {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else {
      setImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.serviceButton}>
          <Text style={styles.serviceButtonText}>Book a Service</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Image
            source={require("../assets/images/person.png")}
            style={styles.profilePicture}
          />
          <Text style={styles.welcomeText}>"Welcome Mobile User"</Text>
        </View>

        {/* First Carousel (Cards with Images) */}
        <FlatList
          data={cards}
          renderItem={({ item }) => (
            <View style={[styles.card, styles.carouselBorder]}>
              <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.cardText}>{item.text}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More About Us</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `card-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 10} // Ensures smooth snapping
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />

        {/* Image Carousel (with Left/Right Chevron inside) */}
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={images}
            renderItem={renderImageCarouselItem}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            style={{ marginVertical: 20 }} // Add space between carousels
          />
        </View>

        {/* Product Range Carousel */}
        <FlatList
          data={ranges}
          renderItem={({ item }) => (
            <View style={[styles.card, styles.carouselBorder]}>
              <Text style={styles.rangeTitle}>{item.title}</Text>
              <Text style={styles.rangeDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate(item.route)}
              >
                <Text style={styles.exploreButtonText}>{item.buttonText}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `range-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 10}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <BottomNavBar navigation={navigation} /> */}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  logo: {
    width: 120,
    height: 90,
  },
  serviceButton: {
    backgroundColor: "#00aaff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  serviceButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for bottom nav
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginLeft: 10,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 16,
    alignItems: "center",
    width: ITEM_WIDTH,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  cardText: {
    color: "#aaa", // Light white-grey color
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  readMoreText: {
    color: "#fff",
    marginRight: 8,
  },
  imageCarouselItem: {
    width: IMAGE_WIDTH,
    height: 200,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  carouselBorder: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 8,
  },
  rangeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rangeDescription: {
    color: "#aaa", // Light white-grey color
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    marginRight: 8,
  },
  imageCarouselContainer: {
    position: "relative", // For positioning left/right navigation buttons inside the carousel
  },
  navIconLeft: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
    left: 0,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  navIconRight: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
    right: 0,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00aaff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 70,
  },
});
