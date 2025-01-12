import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendChatOpenEvent } from '../Services/chatApi';
import AIChatComponent from '../components/AIChatComponent';

const ChatWithBot = ({ navigation }) => {
  const phoneNumber = '+61 0392406822';
  const userId = 'user123'; // Replace with actual user ID management
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialMessage, setInitialMessage] = useState(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const data = await sendChatOpenEvent(userId);
      setInitialMessage({
        role: 'assistant',
        content: data.response,
        options: [
          "Product details",
          "Installation or maintenance",
          "Warranty and certifications",
          "Contact information",
          "Spare parts"
        ]
      });
      setIsInitialized(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize chat. Please try again.');
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LuusBot</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleCallPress}>
          <Ionicons name="call-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {isInitialized ? (
          <AIChatComponent userId={userId} initialMessage={initialMessage} />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Initializing chat...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
      <View style={styles.navbarSpacer} />
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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 25 : 30,
  },
  navbarSpacer: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ChatWithBot;

