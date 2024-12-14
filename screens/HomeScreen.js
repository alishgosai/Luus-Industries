import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  Alert,
  SafeAreaView,
  FlatList, // Ensure FlatList is imported
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85; // For carousel cards with part of the next item visible
const IMAGE_WIDTH = width * 0.75; // For image carousel

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Login");
  const [forgotPasswordStep, setForgotPasswordStep] = useState("EnterEmail");

  // Input states for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  // Input states for Register
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  // Input states for Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});

  // Define the 'cards' array
  const cards = [
    {
      id: "1",
      text: "Your kitchen is our vision. Housed within a purpose-built facility in Melbourne's West, Luus Industries are proudly committed to being the leading manufacturer and solutions provider of commercial catering equipment in Australia.",
      image: require("../assets/images/image19.png"), // Using image19.png
    },
    {
      id: "2",
      text: "Another vision for your kitchen. With enhanced facilities, we aim to redefine quality and efficiency for modern catering equipment.",
      image: require("../assets/images/image19.png"), // Using image19.png
    },
  ];

  // Data for product showcase
  const products = [
    {
      id: "1",
      title: "Commercial Ovens",
      description:
        "High-efficiency ovens designed for commercial kitchens. Reliable and easy to maintain.",
      image: require("../assets/images/image19.png"), // Using image19.png
      route: "CommercialOvens",
    },
    {
      id: "2",
      title: "Refrigeration Units",
      description:
        "State-of-the-art refrigeration solutions to keep your ingredients fresh and safe.",
      image: require("../assets/images/image19.png"), // Using image19.png
      route: "RefrigerationUnits",
    },
    {
      id: "3",
      title: "Food Preparation Equipment",
      description:
        "Durable and versatile equipment to streamline your food preparation processes.",
      image: require("../assets/images/image19.png"), // Using image19.png
      route: "FoodPreparation",
    },
    {
      id: "4",
      title: "Dishwashers",
      description:
        "Efficient dishwashing solutions that save time and water without compromising cleanliness.",
      image: require("../assets/images/image19.png"), // Using image19.png
      route: "Dishwashers",
    },
    // Add more products as needed
  ];

  // Data for testimonials
  const testimonials = [
    {
      id: "1",
      name: "John Doe",
      feedback:
        "Luus Industries provided us with top-notch equipment that has transformed our kitchen operations.",
      image: require("../assets/images/image19.png"), // Using image19.png
    },
    {
      id: "2",
      name: "Jane Smith",
      feedback:
        "Exceptional quality and customer service. Highly recommend Luus for all your catering needs.",
      image: require("../assets/images/image19.png"), // Using image19.png
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

  // Reset forgotPasswordStep when switching to ForgotPassword tab
  useEffect(() => {
    if (activeTab === "ForgotPassword") {
      setForgotPasswordStep("EnterEmail");
    }
  }, [activeTab]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (activeTab === "ForgotPassword") {
        if (forgotPasswordStep === "SetNewPassword") {
          setForgotPasswordStep("VerifyCode");
          return true;
        } else if (forgotPasswordStep === "VerifyCode") {
          setForgotPasswordStep("EnterEmail");
          return true;
        } else if (forgotPasswordStep === "EnterEmail") {
          setActiveTab("Login");
          return true;
        }
      } else if (activeTab === "Register") {
        setActiveTab("Login");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [activeTab, forgotPasswordStep]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  // Validation functions
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginEmail)) {
      errors.email = "Invalid email format";
    }
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerName) {
      errors.name = "Name is required";
    }
    if (!registerEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(registerEmail)) {
      errors.email = "Invalid email format";
    }
    if (!registerPassword) {
      errors.password = "Password is required";
    } else if (registerPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!registerConfirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerPassword !== registerConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotEmail = () => {
    const errors = {};
    if (!forgotEmail) {
      errors.email = "Email is required";
    } else if (!validateEmail(forgotEmail)) {
      errors.email = "Invalid email format";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotCode = () => {
    const errors = {};
    if (!forgotCode) {
      errors.code = "Code is required";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewPassword = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }
    setForgotErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const renderForgotPassword = () => {
    if (forgotPasswordStep === "EnterEmail") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={forgotEmail}
            onChangeText={setForgotEmail}
          />
          {forgotErrors.email && (
            <Text style={styles.errorText}>{forgotErrors.email}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotEmail()) {
                // Implement actual send code logic here
                setForgotPasswordStep("VerifyCode");
                setForgotErrors({});
              }
            }}
          >
            <Text style={styles.actionButtonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      );
    } else if (forgotPasswordStep === "VerifyCode") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            value={forgotCode}
            onChangeText={setForgotCode}
          />
          {forgotErrors.code && (
            <Text style={styles.errorText}>{forgotErrors.code}</Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateForgotCode()) {
                // Implement actual verify code logic here
                setForgotPasswordStep("SetNewPassword");
                setForgotErrors({});
              }
            }}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity
              onPress={() => {
                // Implement resend code logic here
                Alert.alert(
                  "Code Resent",
                  "A new code has been sent to your email."
                );
              }}
            >
              <Text style={styles.footerLink}>Send Code Again</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (forgotPasswordStep === "SetNewPassword") {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {forgotErrors.newPassword && (
            <Text style={styles.errorText}>{forgotErrors.newPassword}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          {forgotErrors.confirmNewPassword && (
            <Text style={styles.errorText}>
              {forgotErrors.confirmNewPassword}
            </Text>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (validateNewPassword()) {
                // Implement actual password reset logic here
                Alert.alert("Success", "Your password has been reset.");
                setActiveTab("Login");
                setForgotErrors({});
              }
            }}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.forgotFooterLinks}>
            <TouchableOpacity
              onPress={() => {
                setActiveTab("Login");
              }}
            >
              <Text style={styles.footerLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

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

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate(item.route)}
    >
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productOverlay}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.productButton}>
          <Text style={styles.productButtonText}>Learn More</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTestimonialItem = ({ item }) => (
    <View style={styles.testimonialCard}>
      <Image source={item.image} style={styles.testimonialImage} resizeMode="cover" />
      <Text style={styles.testimonialFeedback}>"{item.feedback}"</Text>
      <Text style={styles.testimonialName}>- {item.name}</Text>
    </View>
  );

  const renderImageCarouselItem = ({ item }) => (
    <Image source={item} style={styles.imageCarouselItem} />
  );

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
                source={require("../assets/images/image19.png")} // Using image19.png
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
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />

          {/* Image Carousel */}
          <View style={styles.imageCarouselContainer}>
            <FlatList
              data={[
                require("../assets/images/image19.png"),
                require("../assets/images/image19.png"),
                require("../assets/images/image19.png"),
                require("../assets/images/image19.png"),
              ]} // All image19.png
              renderItem={renderImageCarouselItem}
              keyExtractor={(item, index) => `image-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
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
              contentContainerStyle={{ paddingHorizontal: 20 }}
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
                    <TouchableOpacity style={styles.productButton}>
                      <Text style={styles.productButtonText}>Learn More</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* About Us Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About Us</Text>
            <View style={styles.aboutContainer}>
              <Image
                source={require("../assets/images/image19.png")} // Using image19.png
                style={styles.aboutImage}
                resizeMode="cover"
              />
              <Text style={styles.aboutText}>
                Luus Industries is dedicated to providing top-of-the-line
                commercial catering equipment tailored to your kitchen's needs.
                With years of experience, we ensure quality, reliability, and
                exceptional customer service.
              </Text>
            </View>
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
            <Text style={styles.ctaText}>
              Ready to upgrade your kitchen?
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("ContactUs")}
            >
              <Text style={styles.ctaButtonText}>Contact Us</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
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
    paddingBottom: 20, // Adjusted padding
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
    backgroundColor: "#00aaff",
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
    marginTop: 10,
  },
  readMoreText: {
    color: "#fff",
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  imageCarouselContainer: {
    // Removed unused positioning
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
    paddingVertical: 8,
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
  aboutContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  aboutImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  aboutText: {
    color: "#ddd",
    fontSize: 14,
    flex: 1,
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
    backgroundColor: "#00aaff",
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
    backgroundColor: "#0077cc",
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
  errorText: {
    width: "100%",
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: "#00aaff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerLink: {
    color: "#00aaff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
