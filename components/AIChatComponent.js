import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchChatHistory, sendChatMessage, sendChatOpenEvent } from '../Services/chatApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_STORAGE_KEY = 'LUUS_CHAT_HISTORY';
const CHAT_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const TypingIndicator = () => {
  const [dotOpacity] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => animateDot(dot, delay));
    };

    dotOpacity.forEach((dot, index) => {
      setTimeout(() => animateDot(dot, index * 200), index * 200);
    });
  }, []);

  return (
    <View style={styles.typingIndicator}>
      {dotOpacity.map((dot, index) => (
        <Animated.View key={index} style={[styles.typingDot, { opacity: dot }]} />
      ))}
    </View>
  );
};

const AIChatComponent = ({ userId, initialMessage }) => {
  const [messages, setMessages] = useState(initialMessage ? [initialMessage] : []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  const loadChatHistory = async () => {
    try {
      const storedData = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedData) {
        const { timestamp, messages } = JSON.parse(storedData);
        const now = new Date().getTime();
        if (now - timestamp < CHAT_EXPIRY_TIME) {
          setMessages(messages);
        } else {
          await sendOpenEvent();
        }
      } else {
        await sendOpenEvent();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      await sendOpenEvent();
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      const data = {
        timestamp: new Date().getTime(),
        messages: newMessages,
      };
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendOpenEvent = async () => {
    if (!userId) return;
    try {
      setIsBotThinking(true);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const response = await sendChatOpenEvent(userId);
      setIsBotThinking(false);
      if (response && response.response) {
        const welcomeMessage = {
          role: 'assistant',
          content: response.response,
          options: response.options || [
            "Product Details",
            "Warranty",
            "Contact Information",
            "Spare Parts"
          ]
        };
        await simulateTyping(welcomeMessage);
        setMessages([welcomeMessage]);
        await saveChatHistory([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error sending chat open event:', error);
      Alert.alert('Error', 'Failed to initialize chat. Please try again.');
    }
  };

  const simulateTyping = async (message) => {
    setIsBotTyping(true);
    const words = message.content.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[updatedMessages.length - 1]?.role === 'assistant') {
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: words.slice(0, i + 1).join(' '),
            isPartial: true
          };
        } else {
          updatedMessages.push({
            role: 'assistant',
            content: words.slice(0, i + 1).join(' '),
            isPartial: true
          });
        }
        return updatedMessages;
      });
    }
    setIsBotTyping(false);
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...message,
        isPartial: false
      };
      return updatedMessages;
    });
  };

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || !userId) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    setIsBotThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsBotThinking(false);

    try {
      console.log('Sending message:', messageText);
      const data = await sendChatMessage([...messages, userMessage], userId);
      console.log('Received response:', data);
      if (data && data.response) {
        const botMessage = {
          role: 'assistant',
          content: data.response,
          options: data.options,
          externalLink: data.externalLink
        };
        await simulateTyping(botMessage);
        saveChatHistory([...messages, userMessage, botMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error in sendMessage:', err);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessages(prevMessages => prevMessages.slice(0, -1));
    }
  }, [messages, userId]);

  const handleInputChange = (text) => {
    setInput(text);
    setIsTyping(text.length > 0);
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  const handleLinkPress = useCallback((url) => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
          Alert.alert("Error", "Cannot open this link");
        }
      });
    }
  }, []);

  const handleContactAction = (action) => {
    if (action === 'call') {
      Linking.openURL(`tel:+61392406822`);
    } else if (action === 'book') {
      navigation.navigate('ServiceForm');
    }
  };

  const renderMessage = ({ item, index }) => {
    if (item.role === 'assistant') {
      return (
        <View style={styles.botMessageContainer}>
          <Image
            source={require('../assets/images/chatbot.png')}
            style={styles.botAvatar}
          />
          <View style={[styles.botMessageBubble, item.isPartial && styles.partialMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
            {!item.isPartial && item.content === "How would you like to get in touch with Luus Industries?" && (
              <View style={styles.contactOptionsContainer}>
                <TouchableOpacity onPress={() => handleContactAction('call')} style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Call Us</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleContactAction('book')} style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Book a Service</Text>
                </TouchableOpacity>
              </View>
            )}
            {!item.isPartial && item.externalLink && (
              <View style={styles.linkContainer}>
                <Text style={styles.messageText}>For more information visit our website:</Text>
                <Text style={styles.urlText} onPress={() => handleLinkPress(item.externalLink)}>
                  {item.externalLink}
                </Text>
              </View>
            )}
            {!item.isPartial && item.options && (
              <View style={styles.optionsContainer}>
                {item.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
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

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      {isBotThinking && (
        <View style={styles.botActivityContainer}>
          <Text style={styles.botActivityText}>LuusBot is thinking</Text>
          <TypingIndicator />
        </View>
      )}
      {isBotTyping && (
        <View style={styles.botActivityContainer}>
          <Text style={styles.botActivityText}>LuusBot is typing</Text>
          <TypingIndicator />
        </View>
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask LuusBot a question..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Ionicons name="arrow-forward" size={24} color={input.trim() ? "#87CEEB" : "#666"} />
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
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
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
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#2B78E4',
    padding: 9,
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
    marginBottom: -3,
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
  sendButtonDisabled: {
    opacity: 0.5,
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
  partialMessage: {
    opacity: 0.7,
  },
  urlText: {
    fontSize: 16,
    color: '#2B78E4',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  linkContainer: {
    marginTop: 10,
  },
  contactOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: '#87CEEB',
    padding: 10,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  botActivityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontStyle: 'italic',
    marginRight: 10,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  typingText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default AIChatComponent;

