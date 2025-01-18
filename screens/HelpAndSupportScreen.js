import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HelpAndSupportScreen = () => {
  const navigation = useNavigation();
  const phoneNumber = '+61 0392406822';

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

  const handleItemPress = (type) => {
    console.log('Item pressed:', type);
    switch(type) {
      case 'chatbot':
        navigation.navigate('ChatWithBot');
        break;
      case 'call':
        handleCallPress();
        break;
      case 'faq':
        navigation.navigate('FAQs');
        break;
      default:
        console.warn('Unknown item type:', type);
    }
  };

  const SupportItem = ({ icon, label, description, type }) => (
    <TouchableOpacity 
      style={styles.supportItem}
      onPress={() => handleItemPress(type)}
    >
      <View style={styles.supportItemIcon}>
        <Icon name={icon} size={28} color="#000000" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  supportItemIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  supportItemContent: {
    flex: 1,
    paddingVertical: 8,
  },
  supportItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  supportItemDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
});

export default HelpAndSupportScreen;

