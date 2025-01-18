import React, { useState, useCallback, useRef } from "react";
import { fetchUserProfile } from '../Services/userApi';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

const BUTTON_COLOR = "#87CEEB";
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85;
const IMAGE_WIDTH = width * 0.75;
const CLIENT_IMAGE_SIZE = 60;
const CLIENT_IMAGE_MARGIN_RIGHT = 10;
const CLIENT_COUNT = 10;
const TOTAL_CLIENTS_WIDTH =
  (CLIENT_IMAGE_SIZE + CLIENT_IMAGE_MARGIN_RIGHT) * CLIENT_COUNT;

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const cards = [
    {
      id: "1",
      text: "Your kitchen is our vision. Housed within a purpose-built facility in Melbourne's West, Luus Industries are proudly committed to being the leading manufacturer and solutions provider of commercial catering equipment in Australia.",
      image: require("../assets/images/image19.png"),
    },
    {
      id: "2",
      text: "Another vision for your kitchen. With enhanced facilities, we aim to redefine quality and efficiency for modern catering equipment.",
      image: require("../assets/images/feature2.jpg"),
    },
  ];

  const products = [
    {
      id: "1",
      title: "Duck Oven",
      description: "Perfectly designed ovens for preparing roasted duck with precision and consistency.",
      image: require("../assets/images/duck-oven.jpg"),
      route: "DuckOven",
    },
    {
      id: "2",
      title: "Noodle Cooker",
      description: "High-performance noodle cookers that ensure quick and efficient cooking for large batches.",
      image: require("../assets/images/noodlecooker.jpg"),
      route: "NoodleCooker",
    },
    {
      id: "3",
      title: "Oven Ranges",
      description: "Versatile oven ranges suitable for all your baking and cooking needs in a commercial kitchen.",
      image: require("../assets/images/Ovenranges.jpg"),
      route: "OvenRanges",
    },
    {
      id: "4",
      title: "Pasta Cooker",
      description: "Efficient pasta cookers designed to deliver perfectly cooked pasta every time.",
      image: require("../assets/images/pasta-cooker.jpg"),
      route: "PastaCooker",
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "John Doe",
      feedback: "Luus Industries provided us with top-notch equipment that has transformed our kitchen operations.",
      image: require("../assets/images/person.png"),
    },
    {
      id: "2",
      name: "Jane Smith",
      feedback: "Exceptional quality and customer service. Highly recommend Luus for all your catering needs.",
      image: require("../assets/images/person.png"),
    },
  ];

  const ranges = [
    {
      title: "ASIAN RANGE",
      description: "We've been involved in Asian cuisine since birth! With that in mind, we hold Asian food, and the people who prepare it, close to our hearts. We notice every little detail. Our intricate knowledge of the demands of Asian cooking mean we've taken care of the frustrations Asian chefs often experience.",
      buttonText: "Explore Asian Products",
      route: "AsianProducts",
    },
    {
      title: "PROFESSIONAL RANGE",
      description: "Engineered with higher specifications, heavy duty construction and time-saving features, our Professional Series of commercial cooking equipment excels in all restaurants, hotels and franchises looking for extra performance, reliability and style. Standing a compact 800mm in depth, all units are ideal for small spaces and offer outstanding quality and exceptional value. Our Professional Series will transform your kitchen.",
      buttonText: "Explore Professional Products",
      route: "ProfessionalProducts",
    },
    {
      title: "SPARE PARTS",
      description: "Ensure the longevity and optimal performance of your equipment with our wide range of spare parts. From essential components to specialized replacements, we have everything you need to keep your kitchen running smoothly.",
      buttonText: "Explore Spare Parts",
      route: "SpareParts",
    },
  ];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1],
    extrapolate: 'clamp',
  });

  const renderRangeItem = ({ item }) => (
    <View style={[styles.card, styles.rangeCard]}>
      <Text style={styles.rangeTitle}>{item.title}</Text>
      <Text style={styles.rangeDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate(item.route)}
      >
        <Text style={styles.exploreButtonText}>{item.buttonText}</Text>
        <Ionicons name="arrow-forward" size={16} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const getUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching user profile...');
      const userProfile = await fetchUserProfile();
      console.log('User profile fetched:', userProfile);
      setUserData({
        name: userProfile.name || "Guest",
        avatar: userProfile.avatar || null
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserData({ name: "Guest", avatar: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [getUserData])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.container}>
        <Animated.View style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 1000,
          }
        ]}>
          <Animated.Image
            source={require("../assets/images/logo.png")}
            style={[
              styles.logo,
              { transform: [{ scale: logoScale }] }
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => navigation.navigate("ServiceForm")}
          >
            <Text style={styles.serviceButtonText}>Book a Service</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View style={{ paddingTop: HEADER_MAX_HEIGHT }}>
            {userData && (
              <View style={styles.welcomeBorder}>
                <View style={styles.welcomeContainer}>
                  <Image
                    source={userData.avatar ? { uri: userData.avatar } : require("../assets/images/person.png")}
                    style={styles.profilePicture}
                  />
                  <Text style={styles.welcomeText}>{`Welcome ${userData.name}`}</Text>
                </View>
              </View>
            )}
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

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
                    <Ionicons name="arrow-forward" size={16} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + 10}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <View style={styles.imageCarouselContainer}>
              <FlatList
                data={[
                  require("../assets/images/products-feature1.jpg"),
                  require("../assets/images/aLCfeature-1.jpg"),
                  require("../assets/images/feature3.jpg"),
                  require("../assets/images/image19-1.png"),
                  require("../assets/images/feature2.jpg"),
                ]}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.imageCarouselItem} />
                )}
                keyExtractor={(item, index) => `image-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                style={{ marginVertical: 20 }}
              />
            </View>

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

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Our Products</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => navigation.navigate(item.route)}
                  >
                    <Image
                      source={item.image}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productOverlay}>
                      <Text style={styles.productTitle}>{item.title}</Text>
                      <Text style={styles.productDescription}>
                        {item.description}
                      </Text>
                      <TouchableOpacity
                        style={styles.productButton}
                        onPress={() => navigation.navigate(item.route)}
                      >
                        <Text style={styles.productButtonText}>Learn More</Text>
                        <Ionicons name="arrow-forward" size={16} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>What Our Clients Say</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={testimonials}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.testimonialCard}>
                    <Image
                      source={item.image}
                      style={styles.testimonialImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.testimonialFeedback}>
                      "{item.feedback}"
                    </Text>
                    <Text style={styles.testimonialName}>
                      - {item.name}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Ready to upgrade your kitchen?</Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate("ChatWithBot")}
              >
                <Text style={styles.ctaButtonText}>Contact Us</Text>
                <Ionicons name="arrow-forward" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
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
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  serviceButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  welcomeBorder: {
    borderWidth: 0.3,
    borderColor: BUTTON_COLOR,
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
    borderColor: "#333",
    borderRadius: 8,
    padding: 8,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  cardText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  readMoreText: {
    color: "#000",
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
    borderColor: "#333",
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
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  exploreButtonText: {
    color: "#000",
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
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
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  productButtonText: {
    color: "#000",
    fontSize: 12,
    marginRight: 5,
    fontWeight: "600",
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
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 20,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#000",
    fontSize: 14,
    marginRight: 5,
    fontWeight: "600",
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

