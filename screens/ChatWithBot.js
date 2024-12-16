import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatWithBot = ({ navigation }) => {
  const [message, setMessage] = useState('');
  
  const messages = [
    {
      id: 1,
      type: 'bot',
      text: 'Hello, Jhon how can i help you?'
    },
    {
      id: 2,
      type: 'user',
      text: 'I want to get a spare parts for my oven'
    },
    {
      id: 3,
      type: 'bot',
      text: 'Of course, click here to see',
      link: 'Spare Parts'
    },
    {
      id: 4,
      type: 'user',
      text: 'And also ,I need a technician for monday.'
    },
    {
      id: 5,
      type: 'bot',
      text: 'Would like continuing chatwith AI or chat with Admin/person'
    },
    {
      id: 6,
      type: 'user',
      text: 'All good,thank you'
    },
  ];

  const renderMessage = (message) => {
    if (message.type === 'bot') {
      return (
        <View key={message.id} style={styles.botMessageContainer}>
          <Image
            source={require('../assets/images/chatbot.png')}
            style={styles.botAvatar}
          />
          <View style={styles.botMessageBubble}>
            <Text style={styles.messageText}>
              {message.text}
              {message.link && (
                <Text style={styles.linkText}> {message.link}</Text>
              )}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View key={message.id} style={styles.userMessageContainer}>
          <View style={styles.userMessageBubble}>
            <Text style={styles.userMessageText}>{message.text}</Text>
          </View>
        </View>
      );
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
        <Text style={styles.headerTitle}>ChatBot</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Chat Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(message => renderMessage(message))}
        </ScrollView>

        {/* Updated Message Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message"
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="arrow-forward" size={24} color="#87CEEB" />
            </TouchableOpacity>
          </View>
        </View>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 30,
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  botAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  botMessageBubble: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#2B78E4',
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    lineHeight: 24,
  },
  userMessageText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 24,
  },
  linkText: {
    color: '#2B78E4',
    textDecorationLine: 'underline',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    marginBottom: Platform.OS === 'ios' ? 50 : 30, // Increased from 30 and 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  sendButton: {
    padding: 10,
    marginRight: 5,
  },
  bottomNavBar: {
    marginTop: 10, // Add this line
  },
});

export default ChatWithBot;

