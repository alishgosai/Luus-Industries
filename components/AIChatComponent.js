import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API_URL from '../backend/config/api';

const AIChatComponent = ({ userId, initialMessage }) => {
  const [messages, setMessages] = useState(initialMessage ? [initialMessage] : []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!initialMessage) {
      fetchChatHistory();
    }
  }, [initialMessage]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/history/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      if (data.length > 0) {
        setMessages(data);
      }
      // If there's no chat history, we keep the initial welcome message (if any)
    } catch (error) {
      console.error('Error fetching chat history:', error);
      Alert.alert('Error', 'Failed to load chat history. Please try again.');
    }
  };

  const sendMessage = useCallback(async (messageText) => {
    const userMessage = { role: 'user', content: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
      setInput('');
    }
  }, [userId, messages]);

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  const renderMessage = ({ item }) => {
    if (item.role === 'assistant') {
      return (
        <View style={styles.botMessageContainer}>
          <Image
            source={require('../assets/images/chatbot.png')}
            style={styles.botAvatar}
          />
          <View style={styles.botMessageBubble}>
            <Text style={styles.messageText}>{item.content}</Text>
            {item.options && (
              <View style={styles.optionsContainer}>
                {item.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleOptionClick(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.userMessageContainer}>
          <View style={styles.userMessageBubble}>
            <Text style={styles.userMessageText}>{item.content}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>LuusBot is typing...</Text>
        </View>
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask LuusBot a question..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input)}>
            <Ionicons name="arrow-forward" size={24} color="#87CEEB" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messageList: {
    flex: 1,
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 16,
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
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    lineHeight: 22,
  },
  userMessageText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  typingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#000000',
    borderTopWidth: 0,
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
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 15,
    marginTop: 5,
  },
  optionText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AIChatComponent;

