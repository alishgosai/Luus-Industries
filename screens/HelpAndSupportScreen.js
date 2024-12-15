import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help And Support</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32, 
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
});

export default HelpAndSupportScreen;

