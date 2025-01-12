import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchChatHistory, sendChatMessage } from '../Services/chatApi';

const AIChatComponent = ({ userId, initialMessage }) => {
  const [messages, setMessages] = useState(initialMessage ? [initialMessage] : []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!initialMessage) {
      fetchHistory();
    }
  }, [initialMessage]);

  const fetchHistory = async () => {
    try {
      const data = await fetchChatHistory(userId);
      if (data.length > 0) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      Alert.alert('Error', 'Failed to load chat history. Please try again.');
    }
  };

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    setInput(''); // Clear input field after sending message

    try {
      console.log('Sending message:', messageText);
      const data = await sendChatMessage([...messages, userMessage], userId);
      console.log('Received response:', data);
      if (data && data.response) {
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
      } else {
        const defaultResponse = getDefaultResponse(messageText);
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: defaultResponse }]);
      }
    } catch (err) {
      console.error('Error in sendMessage:', err);
      const defaultResponse = getDefaultResponse(messageText);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: defaultResponse }]);
    } finally {
      setIsTyping(false);
    }
  }, [userId, messages]);

  const getDefaultResponse = (message) => {
    const defaultResponses = [
      "I'm sorry, I didn't quite understand that. Could you please rephrase your question?",
      "That's an interesting point. Could you provide more details?",
      "I'm here to help with any questions about Luus products. What specific information are you looking for?",
      "Thank you for your question. Let me find the best information for you.",
      "I'm always learning. Could you elaborate on your request?"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

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

