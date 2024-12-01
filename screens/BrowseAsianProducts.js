import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function AsianKitchenScreen({ navigation }) {
  const products = [
    'FO SAN WOKS',
    'COMPACT WATERLESS WOKS',
    'COMPACT WATERLESS STOCKPOTS',
    'FREESTANDING STOCKPOTS',
    'NOODLE COOKER',
    'STEAM CABINETS',
    'AUTO REFILL STEAMERS',
    'TRADITIONAL STEAMERS',
    'DUCK OVEN',
    'TEPPANYAKI GRILLS',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/150x50.png' }}
          style={styles.banner}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Breadcrumbs */}
        <Text style={styles.breadcrumbs}>Home &gt; Products &gt; Asian</Text>

        {/* Title Section */}
        <Text style={styles.title}>Asian kitchen specialists.</Text>
        <Text style={styles.description}>
          We’ve been involved in Asian cuisine since birth! With that in mind,
          we hold Asian food, and the people who prepare it, close to our
          hearts. We notice every little detail. Our intricate knowledge of the
          demands of Asian cooking mean we’ve taken care of the frustrations
          Asian chefs often experience.
        </Text>
        <Text style={styles.description}>
          Our versatile range is expertly engineered and locally built using
          only the highest quality materials and components, setting us apart
          from the increasing number of inferior imports available on the
          market. Our breadth of products, variety of combinations, options,
          and ability to customise makes us the leading Asian kitchen specialist
          in Australia.
        </Text>

        {/* Products Section */}
        {products.map((product, index) => (
          <TouchableOpacity key={index} style={styles.productItem}>
            <Text style={styles.productText}>{product}</Text>
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>CONTACT US</Text>
          <Text style={styles.footerText}>
            Luus Industries Pty Ltd{'\n'}
            250 Fairbairn Road, Sunshine West,{'\n'}
            VIC 3020, Australia
          </Text>
          <Text style={styles.footerText}>T +61 3 9240 6822</Text>
          <Text style={styles.footerText}>ABN 94 082 257 734</Text>

          <Text style={styles.footerTitle}>PRODUCTS</Text>
          <Text style={styles.footerLink}>Asian</Text>
          <Text style={styles.footerLink}>Professional</Text>
          <Text style={styles.footerLink}>Spare Parts</Text>

          <TouchableOpacity style={styles.newsletterButton}>
            <Text style={styles.newsletterText}>SIGN UP TO NEWSLETTER</Text>
          </TouchableOpacity>

          <Text style={styles.footerTitle}>FOLLOW US</Text>
          <View style={styles.socialIcons}>
            <Image
              source={{ uri: 'https://via.placeholder.com/30' }}
              style={styles.socialIcon}
            />
            <Image
              source={{ uri: 'https://via.placeholder.com/30' }}
              style={styles.socialIcon}
            />
            <Image
              source={{ uri: 'https://via.placeholder.com/30' }}
              style={styles.socialIcon}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  banner: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  scrollContent: {
    padding: 15,
  },
  breadcrumbs: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
  },
  productItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  productText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  footerLink: {
    color: '#00aaff',
    fontSize: 14,
    marginBottom: 10,
  },
  newsletterButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  newsletterText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
});
