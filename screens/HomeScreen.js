import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [rangeIndex, setRangeIndex] = useState(0);

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
      images: [
        require("../assets/images/image19.png"),
        require("../assets/images/image19.png"),
        require("../assets/images/image19.png"),
      ],
    },
    {
      title: "PROFESSIONAL RANGE",
      description:
        "Built for the experts, our professional range ensures efficiency, reliability, and top-notch performance for your culinary needs.",
      buttonText: "Explore Professional Products",
      route: "ProfessionalProducts",
      images: [
        require("../assets/images/image19-1.png"),
        require("../assets/images/image19-1.png"),
      ],
    },
  ];

  const handleCardChange = (direction) => {
    if (direction === "next") {
      setCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    } else {
      setCardIndex((prevIndex) =>
        prevIndex === 0 ? cards.length - 1 : prevIndex - 1
      );
    }
  };

  const handleRangeChange = (direction) => {
    if (direction === "next") {
      setRangeIndex((prevIndex) => (prevIndex + 1) % ranges.length);
    } else {
      setRangeIndex((prevIndex) =>
        prevIndex === 0 ? ranges.length - 1 : prevIndex - 1
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
          <Text style={styles.welcomeText}>"Welcome LUUS User"</Text>
        </View>

        {/* Card Carousel Section */}
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            style={styles.navIcon}
            onPress={() => handleCardChange("prev")}
          >
            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.card}>
            <Image
              source={cards[cardIndex].image}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Text style={styles.cardText}>{cards[cardIndex].text}</Text>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read More About Us</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.navIcon}
            onPress={() => handleCardChange("next")}
          >
            <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Range Section */}
        <View style={styles.rangeSection}>
          <View style={styles.rangeImageGrid}>
            {ranges[rangeIndex].images.map((image, index) => (
              <Image
                key={index}
                source={image}
                style={styles.rangeImage}
                resizeMode="cover"
              />
            ))}
          </View>
          <View style={styles.rangeContent}>
            <Text style={styles.rangeTitle}>{ranges[rangeIndex].title}</Text>
            <Text style={styles.rangeDescription}>
              {ranges[rangeIndex].description}
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate(ranges[rangeIndex].route)} // Navigate to the route
            >
              <Text style={styles.exploreButtonText}>
                {ranges[rangeIndex].buttonText}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rangeNavigation}>
            <TouchableOpacity onPress={() => handleRangeChange("prev")}>
              <Ionicons name="chevron-back-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRangeChange("next")}>
              <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavBar navigation={navigation} />
      </View>
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
    paddingVertical: 15,
    paddingBottom: 10,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  logo: {
    width: 100,
    height: 30,
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
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
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
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    padding: 16,
    textAlign: "center",
  },
  readMoreButton: {
    backgroundColor: "#00aaff",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  readMoreText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  navIcon: {
    padding: 8,
  },
  rangeSection: {
    padding: 16,
  },
  rangeImageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rangeImage: {
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    borderRadius: 8,
  },
  rangeContent: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rangeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rangeDescription: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: "#00aaff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  rangeNavigation: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
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
