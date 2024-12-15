import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HelpAndSupportScreen = () => {
  const navigation = useNavigation();

  const SupportItem = ({ icon, label, description }) => (
    <TouchableOpacity style={styles.supportItem}>
      <View style={styles.supportItemIcon}>
        <Icon name={icon} size={24} color="#000000" />
      </View>
      <View style={styles.supportItemContent}>
        <Text style={styles.supportItemLabel}>{label}</Text>
        <Text style={styles.supportItemDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color="#87CEEB" />
          <Text style={styles.headerTitle}>Help And Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <SupportItem 
          icon="robot" 
          label="Chat bot" 
          description="Chat with our AI assistant"
        />
        <SupportItem 
          icon="phone" 
          label="Call us" 
          description="Talk to our customer service"
        />
        <SupportItem 
          icon="frequently-asked-questions" 
          label="FAQs" 
          description="Browse app information"
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="magnify" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="qrcode-scan" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chat" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="account" size={24} color="#87CEEB" />
          <Text style={[styles.navText, styles.navTextActive]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  supportItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportItemContent: {
    flex: 1,
  },
  supportItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  supportItemDescription: {
    fontSize: 14,
    color: '#666666',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#121212',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#87CEEB',
  },
  navText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  navTextActive: {
    color: '#87CEEB',
  },
});

export default HelpAndSupportScreen;

