import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Linking,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API_URL from '../backend/config/api';

const HelpAndSupportScreen = () => {
  const navigation = useNavigation();
  const phoneNumber = '+61 0392406822';
  const [isLoading, setIsLoading] = useState(false);

  const handleCallPress = async () => {
    console.log('Call button pressed');
    const phoneUrl = Platform.select({
      ios: `telprompt:${phoneNumber}`,
      android: `tel:${phoneNumber}`
    });

    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);
      console.log('Can open URL:', canOpen);
      
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to make phone call');
      }
    } catch (error) {
      console.error('Error handling call:', error);
      Alert.alert('Error', 'An error occurred while trying to make the call');
    }
  };

  const handleItemPress = async (type) => {
    console.log('Item pressed:', type);
    setIsLoading(true);
    try {
      switch(type) {
        case 'chatbot':
          await fetch(`${API_URL}/api/support/chat`);
          navigation.navigate('ChatWithBot');
          break;
        case 'call':
          await handleCallPress();
          break;
        case 'faq':
          await fetch(`${API_URL}/api/support/faq`);
          navigation.navigate('FAQs');
          break;
        default:
          console.warn('Unknown item type:', type);
      }
    } catch (error) {
      console.error('Error handling item press:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const SupportItem = ({ icon, label, description, type }) => (
    <TouchableOpacity 
      style={styles.supportItem}
      onPress={() => handleItemPress(type)}
    >
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
            type="chatbot"
          />
          <SupportItem 
            icon="phone" 
            label="Call us" 
            description="Talk to our customer service"
            type="call"
          />
          <SupportItem 
            icon="frequently-asked-questions" 
            label="FAQs" 
            description="Browse app information"
            type="faq"
          />
        </ScrollView>
      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#87CEEB" />
        </View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelpAndSupportScreen;

