import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150x50.png' }}
            style={styles.logo}
          />
          <TouchableOpacity style={styles.serviceButton}>
            <Text style={styles.serviceButtonText}>Book a Service</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x100.png' }}
            style={styles.profilePicture}
          />
          <Text style={styles.welcomeText}>"Welcome LUUS User"</Text>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150.png' }}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>
            Your kitchen is our vision. Housed within a purpose-built facility in Melbourne's West,
            Luus Industries are proudly committed to being the leading manufacturer and solutions
            provider of commercial catering equipment in Australia.
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Read More About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Asian Range Section */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150.png' }}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>ASIAN RANGE</Text>
          <Text style={styles.cardText}>
            We've been involved in Asian cuisine since birth! With that in mind, we hold Asian food,
            and the people who prepare it, close to our hearts. We notice every little detail. Our
            intricate knowledge of the demands of Asian cooking mean we've taken care of the
            frustrations Asian chefs often experience.
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Explore Asian Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.navbarContainer}>
        <BottomNavBar navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 90, // Extra space so content doesn't overlap with the navbar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  logo: {
    width: 150,
    height: 50,
  },
  serviceButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  serviceButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#111',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#000',
  },
})
