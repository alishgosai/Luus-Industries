import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85; // For carousel cards with part of the next item visible
const IMAGE_WIDTH = width * 0.75; // For image carousel
const CLIENT_IMAGE_SIZE = 60; // Size for client images
const CLIENT_IMAGE_MARGIN_RIGHT = 10; // Margin between client images
const CLIENT_COUNT = 10; // Number of client images
const TOTAL_CLIENTS_WIDTH =
  (CLIENT_IMAGE_SIZE + CLIENT_IMAGE_MARGIN_RIGHT) * CLIENT_COUNT;

export default function HomeScreen({ navigation }) {
  // Define the 'cards' array for the first carousel
  const cards = [
    {
      id: "1",
      text: "Your kitchen is our vision. Housed within a purpose-built facility in Melbourne's West, Luus Industries are proudly committed to being the leading manufacturer and solutions provider of commercial catering equipment in Australia.",
      image: require("../assets/images/image19.png"), // Using image19.png
    },
    {
      id: "2",
      text: "Another vision for your kitchen. With enhanced facilities, we aim to redefine quality and efficiency for modern catering equipment.",
      image: require("../assets/images/feature2.jpg"), // Using image19.png
    },
  ];

  // Data for product showcase
  const products = [
    {
      id: "1",
      title: "Duck Oven",
      description:
        "Perfectly designed ovens for preparing roasted duck with precision and consistency.",
      image: require("../assets/images/duck-oven.jpg"), // duck-oven.jpg
      route: "DuckOven",
    },
    {
      id: "2",
      title: "Noodle Cooker",
      description:
        "High-performance noodle cookers that ensure quick and efficient cooking for large batches.",
      image: require("../assets/images/noodlecooker.jpg"), // noodle-cooker.jpg
      route: "NoodleCooker",
    },
    {
      id: "3",
      title: "Oven Ranges",
      description:
        "Versatile oven ranges suitable for all your baking and cooking needs in a commercial kitchen.",
      image: require("../assets/images/Ovenranges.jpg"), // Ovenranges.jpg
      route: "OvenRanges",
    },
    {
      id: "4",
      title: "Pasta Cooker",
      description:
        "Efficient pasta cookers designed to deliver perfectly cooked pasta every time.",
      image: require("../assets/images/pasta-cooker.jpg"), // pasta-cooker.jpg
      route: "PastaCooker",
    },
  ];

  // Data for testimonials
  const testimonials = [
    {
      id: "1",
      name: "John Doe",
      feedback:
        "Luus Industries provided us with top-notch equipment that has transformed our kitchen operations.",
      image: require("../assets/images/person.png"), // Using image19.png
    },
    {
      id: "2",
      name: "Jane Smith",
      feedback:
        "Exceptional quality and customer service. Highly recommend Luus for all your catering needs.",
      image: require("../assets/images/person.png"), // Using image19.png
    },
    // Add more testimonials as needed
  ];

  // Product Ranges including Spare Parts
  const ranges = [
    {
      title: "ASIAN RANGE",
      description:
        "We’ve been involved in Asian cuisine since birth! With that in mind, we hold Asian food, and the people who prepare it, close to our hearts. We notice every little detail. Our intricate knowledge of the demands of Asian cooking mean we’ve taken care of the frustrations Asian chefs often experience.",
      buttonText: "Explore Asian Products",
      route: "AsianProducts",
    },
    {
      title: "PROFESSIONAL RANGE",
      description:
        "Engineered with higher specifications, heavy duty construction and time-saving features, our Professional Series of commercial cooking equipment excels in all restaurants, hotels and franchises looking for extra performance, reliability and style. Standing a compact 800mm in depth, all units are ideal for small spaces and offer outstanding quality and exceptional value. Our Professional Series will transform your kitchen.",
      buttonText: "Explore Professional Products",
      route: "ProfessionalProducts",
    },
    {
      title: "SPARE PARTS",
      description:
        "Ensure the longevity and optimal performance of your equipment with our wide range of spare parts. From essential components to specialized replacements, we have everything you need to keep your kitchen running smoothly.",
      buttonText: "Explore Spare Parts",
      route: "SpareParts",
    },
  ];

  // Animation for "Our Clients" section (Removed as per request)
  // const scrollAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.timing(scrollAnim, {
  //       toValue: 1,
  //       duration: 10000, // Duration of the scroll animation
  //       useNativeDriver: true,
  //     })
  //   ).start();
  // }, [scrollAnim]);

  // Render functions for FlatList components
  const renderRangeItem = ({ item }) => (
    <View style={[styles.card, styles.rangeCard]}>
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
  );

  // "Our Clients" Section Removed

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => navigation.navigate("ServiceBooking")}
          >
            <Text style={styles.serviceButtonText}>Book a Service</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section with Border */}
          <View style={styles.welcomeBorder}>
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/person.png")} // Using image19.png
                style={styles.profilePicture}
              />
              <Text style={styles.welcomeText}>Welcome Mobile User</Text>
            </View>
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
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => navigation.navigate("AboutUs")}
                >
                  <Text style={styles.readMoreText}>Read More About Us</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + 10} // Ensures smooth snapping
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          {/* Image Carousel */}
          <View style={styles.imageCarouselContainer}>
            <FlatList
              data={[
                require("../assets/images/products-feature1.jpg"),
                require("../assets/images/aLCfeature-1.jpg"),
                require("../assets/images/feature3.jpg"),
                require("../assets/images/image19-1.png"),
                require("../assets/images/feature2.jpg"),
              ]} // All image19.png
              renderItem={({ item }) => (
                <Image source={item} style={styles.imageCarouselItem} />
              )}
              keyExtractor={(item, index) => `image-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              style={{ marginVertical: 20 }} // Add space between carousels
            />
          </View>

          {/* Product Range Carousel */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Product Ranges</Text>
            <FlatList
              data={ranges}
              renderItem={renderRangeItem}
              keyExtractor={(item) => item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + 20}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
            />
          </View>

          {/* Product Showcase */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Our Products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productScroll}
            >
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate(product.route)}
                >
                  <Image
                    source={product.image}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productOverlay}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Text style={styles.productDescription}>
                      {product.description}
                    </Text>
                    <TouchableOpacity
                      style={styles.productButton}
                      onPress={() => navigation.navigate(product.route)}
                    >
                      <Text style={styles.productButtonText}>Learn More</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Testimonials Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What Our Clients Say</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.testimonialScroll}
            >
              {testimonials.map((testimonial) => (
                <View key={testimonial.id} style={styles.testimonialCard}>
                  <Image
                    source={testimonial.image}
                    style={styles.testimonialImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.testimonialFeedback}>
                    "{testimonial.feedback}"
                  </Text>
                  <Text style={styles.testimonialName}>
                    - {testimonial.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>Ready to upgrade your kitchen?</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("ContactUs")}
            >
              <Text style={styles.ctaButtonText}>Contact Us</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Add extra padding at the bottom to prevent overlap with navigation bar */}
          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000", // Black background
  },
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60, // Added padding to prevent overlap with bottom navigation
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#000",
    paddingVertical: 10,
  },
  logo: {
    width: 120,
    height: 90,
  },
  serviceButton: {
    backgroundColor: "#00aaff", // Blue button color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  serviceButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  welcomeBorder: {
    borderWidth: 1,
    borderColor: "#00aaff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
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
  carouselBorder: {
    borderWidth: 1,
    borderColor: "#333", // Light and thin border similar to the first carousel card
    borderRadius: 8,
    padding: 8,
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
    paddingVertical: 12, // Consistent padding with 'exploreButton'
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  readMoreText: {
    color: "#fff",
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  imageCarouselContainer: {
    // Additional styles if needed
  },
  imageCarouselItem: {
    width: IMAGE_WIDTH,
    height: 200,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  rangeCard: {
    width: ITEM_WIDTH,
    marginRight: 20,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333", // Light and thin border similar to the first carousel card
  },
  rangeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  rangeDescription: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 12, // Consistent padding with 'readMoreButton'
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  exploreButtonText: {
    color: "#fff",
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  productScroll: {
    paddingVertical: 10,
  },
  productCard: {
    width: width * 0.6,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#111",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  productTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  productDescription: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 10,
  },
  productButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  productButtonText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 5,
    fontWeight: "600",
  },
  testimonialScroll: {
    paddingVertical: 10,
  },
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    alignItems: "center",
  },
  testimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  testimonialFeedback: {
    color: "#ddd",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  testimonialName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  ctaContainer: {
    backgroundColor: "#00aaff", // Blue button color
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 20,
  },
  ctaText: {
    color: "#fff", // Changed text color to white for better visibility
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff", // Maintain the same blue color for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
    fontWeight: "600",
  },
  clientsContainer: {
    flexDirection: "row",
  },
  clientImageContainer: {
    width: CLIENT_IMAGE_SIZE,
    height: CLIENT_IMAGE_SIZE,
    marginRight: CLIENT_IMAGE_MARGIN_RIGHT,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333", // Light and thin border
  },
  clientImage: {
    width: "100%",
    height: "100%",
  },
});
