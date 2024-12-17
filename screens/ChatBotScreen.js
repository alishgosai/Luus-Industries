import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatbotScreen = () => {
  const navigation = useNavigation();
  const phoneNumber = '+61 0392406822';

  const handleChatWithBot = () => {
    navigation.navigate('ChatWithBot');
  };

  const handleCallPress = async () => {
    const phoneUrl = Platform.select({
      ios: `telprompt:${phoneNumber}`,
      android: `tel:${phoneNumber}`
    });

    const canOpen = await Linking.canOpenURL(phoneUrl);
    
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
       
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.headerText}>Hello I'm your Chat Assistant.</Text>
        </View>

        {/* Bot Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/images/chatbot.png')}
            style={styles.botIcon}
          />
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>How can I Help You Today?</Text>

        {/* Option Buttons */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleChatWithBot}>
            <View style={styles.optionIconContainer}>
              <Image
                source={require('../assets/images/MessageBot.png')}
                style={styles.optionIcon}
              />
            </View>
            <Text style={styles.optionTitle}>Chat bot</Text>
            <Text style={styles.optionSubtitle}>Chat with our Robo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleCallPress}>
            <View style={styles.optionIconContainer}>
              <Image
                source={require('../assets/images/Phone.png')}
                style={styles.optionIcon}
              />
            </View>
            <Text style={styles.optionTitle}>Call us</Text>
            <Text style={styles.optionSubtitle}>Talk to our team</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChatWithBot}>
            <Text style={styles.actionButtonText}>Chat with Bot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCallPress}>
            <Text style={styles.actionButtonText}>Chat with Person</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  botIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '42%',
    aspectRatio: 1,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000000',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  actionContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChatbotScreen;

