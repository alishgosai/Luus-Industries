import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ProductInfo() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRODUCT INFO</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: '/placeholder.svg?height=300&width=300' }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.productTitle}>RS 600MM Oven</Text>

        <Text style={styles.description}>
          Compact 600mm wide static oven range with a number of burner/griddle/chargrills configurations available. 
          Flat bottom oven design for even heat distribution.
        </Text>

        <View style={styles.specificationRow}>
          <Text style={styles.specLabel}>Dimensions</Text>
          <Text style={styles.specValue}>600w x 800d x 1100h</Text>
        </View>

        <View style={styles.specificationRow}>
          <Text style={styles.specLabel}>Internal Oven</Text>
          <Text style={styles.specValue}>440w x 550d x 300h</Text>
        </View>

        <View style={styles.specificationRow}>
          <Text style={styles.specLabel}>Oven Doors</Text>
          <Text style={styles.specValue}>Left hinged swing door</Text>
        </View>

        <View style={styles.specificationRow}>
          <Text style={styles.specLabel}>Cleaning</Text>
          <Text style={styles.specValue}>Dishwasher safe spillage bowls</Text>
        </View>

        <TouchableOpacity style={styles.enquireButton}>
          <Text style={styles.enquireButtonText}>Enquire Now</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>View Specification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Download CAD Drawing</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.downloadLinks}>
          <TouchableOpacity style={styles.downloadLink}>
            <Text style={styles.downloadLinkText}>Revit Files RS-48</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadLink}>
            <Text style={styles.downloadLinkText}>Revit Files RS-6P</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#87CEEB',
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
    color: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  infoContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    marginBottom: 16,
    lineHeight: 20,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specLabel: {
    color: '#fff',
    flex: 1,
  },
  specValue: {
    color: '#fff',
    flex: 2,
  },
  enquireButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  enquireButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  linksContainer: {
    marginBottom: 16,
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    color: '#87CEEB',
    textDecorationLine: 'underline',
  },
  downloadLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadLink: {
    flex: 1,
    marginHorizontal: 4,
  },
  downloadLinkText: {
    color: '#87CEEB',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});
