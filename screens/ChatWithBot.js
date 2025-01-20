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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIChatComponent from '../components/AIChatComponent';

const ChatWithBot = ({ navigation }) => {
  const phoneNumber = '+61 0392406822';
  const [userId, setUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const getUserIdAndInitializeChat = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          await initializeChat(storedUserId);
        } else {
          const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
          await AsyncStorage.setItem('userId', newUserId);
          setUserId(newUserId);
          await initializeChat(newUserId);
        }
      } catch (error) {
        console.error('Error retrieving or setting userId:', error);
        Alert.alert('Error', 'Failed to retrieve user information. Please try again.');
      }
    };

    getUserIdAndInitializeChat();
  }, []);

  const initializeChat = async (currentUserId) => {
    try {
      await sendChatOpenEvent(currentUserId);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
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
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LuusBot</Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
          <Ionicons name="call-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {isInitialized ? (
          <AIChatComponent userId={userId} />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Initializing chat...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#87CEEB",
    margin: 16,
    padding: 12,
    borderRadius: 30,
  },
  backButton: {
    marginRight: 8,
  },
  callButton: {
    marginLeft: 8,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 35 : 10,
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

