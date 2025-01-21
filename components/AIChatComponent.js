import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchChatHistory, sendChatMessage, sendChatOpenEvent } from '../Services/chatApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_STORAGE_KEY = 'LUUS_CHAT_HISTORY';
const CHAT_EXPIRY_TIME = 10 * 1000; // 10 seconds in milliseconds

const TypingIndicator = () => {
  const [dotOpacities] = useState([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]);

  useEffect(() => {
    const animations = dotOpacities.map((opacity, index) =>
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ])
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.typingContainer}>
      {dotOpacities.map((opacity, index) => (
        <Animated.View
          key={index}
          style={[
            styles.typingDot,
            {
              opacity,
              transform: [
                {
                  scale: opacity.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const AIChatComponent = ({ userId, initialMessage }) => {
  const [messages, setMessages] = useState(initialMessage ? [initialMessage] : []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) {
      console.error('userId is required for AIChatComponent');
      return;
    }
    loadChatHistory();
  }, [userId]);

  const loadChatHistory = async () => {
    try {
      if (!userId) {
        throw new Error('userId is required');
      }

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
    if (!userId) {
      console.error('userId is required for sending open event');
      return;
    }

    try {
      setIsBotTyping(true);
      const response = await sendChatOpenEvent(userId);
      setIsBotTyping(false);

      if (response && response.response) {
        const welcomeMessage = {
          role: 'assistant',
          content: response.response,
          options: response.options,
          type: response.type || 'buttons'
        };
        setMessages([welcomeMessage]);
        await saveChatHistory([welcomeMessage]);
      }
    } catch (error) {
      setIsBotTyping(false);
      console.error('Error sending open event:', error);
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

  const handleOptionSelect = async (option) => {
    if (!userId) {
      console.error('userId is required');
      Alert.alert('Error', 'Session error. Please restart the app.');
      return;
    }

    const userMessage = {
      role: 'user',
      content: option
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveChatHistory(newMessages);
    setInput('');
    
    setIsBotTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = await sendChatMessage({
        messages: newMessages,
        userId,
        isPartial: false
      });
      
      setIsBotTyping(false);
      
      if (response) {
        const botMessage = {
          role: 'assistant',
          content: response.response,
          options: response.options,
          type: response.type,
          externalLink: response.externalLink
        };
        
        const updatedMessages = [...newMessages, botMessage];
        setMessages(updatedMessages);
        await saveChatHistory(updatedMessages);
      }
    } catch (error) {
      setIsBotTyping(false);
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const userMessage = {
      role: 'user',
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveChatHistory(newMessages);
    setInput('');
    setIsTyping(false);

    try {
      setIsBotTyping(true);
      const response = await sendChatMessage({
        messages: newMessages,
        userId,
        isPartial: false
      });
      
      setIsBotTyping(false);

      if (response) {
        const botMessage = {
          role: 'assistant',
          content: response.response,
          options: response.options,
          type: response.type,
          externalLink: response.externalLink
        };

        const updatedMessages = [...newMessages, botMessage];
        setMessages(updatedMessages);
        await saveChatHistory(updatedMessages);
      }
    } catch (error) {
      setIsBotTyping(false);
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleInputChange = (text) => {
    setInput(text);
    setIsTyping(text.length > 0);
  };

  const handleContactAction = (action) => {
    if (action === 'call') {
      Linking.openURL(`tel:+61392406822`);
    } else if (action === 'book') {
      navigation.navigate('ServiceForm');
    }
  };

  const renderMessage = ({ item }) => {
    const isBot = item.role === 'assistant';
    const hasOptions = item.options && item.options.length > 0;
    const hasExternalLink = item.externalLink;

    return (
      <View style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
        {isBot && (
          <View style={styles.botIconContainer}>
            <Image source={require('../assets/images/chatbot.png')} style={styles.botIcon} />
          </View>
        )}
        <View style={[styles.messageContent, isBot ? styles.botMessageContent : styles.userMessageContent]}>
          <Text style={[styles.messageText, isBot ? styles.botMessageText : styles.userMessageText]}>
            {item.content}
          </Text>
          
          {/* Always show options if they exist */}
          {hasOptions && (
            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    item.type === 'buttons' && styles.primaryOptionButton
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    item.type === 'buttons' && styles.primaryOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Render external link if available */}
          {hasExternalLink && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleLinkPress(item.externalLink)}
            >
              <Text style={styles.linkText}>View More Details →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open the link');
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isBotTyping && (
        <View style={styles.typingIndicatorContainer}>
          <View style={styles.botIconContainer}>
            <Image source={require('../assets/images/chatbot.png')} style={styles.botIcon} />
          </View>
          <View style={styles.typingContent}>
            <TypingIndicator />
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleInputChange}
          placeholder="Ask LuusBot a question..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Ionicons name="arrow-forward" size={24} color={input.trim() ? "#87CEEB" : "#666"} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  primaryOptionButton: {
    backgroundColor: '#2B78E4',
  },
  optionText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryOptionText: {
    color: '#FFFFFF',
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
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    maxWidth: '80%',
  },
  typingContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginLeft: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#87CEEB',
    marginHorizontal: 3,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botIconContainer: {
    marginRight: 10,
  },
  botIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
  },
  messageContent: {
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%',
  },
  botMessageContent: {
    backgroundColor: '#FFFFFF',
  },
  userMessageContent: {
    backgroundColor: '#2B78E4',
  },
  botMessageText: {
    color: '#000',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  linkButton: {
    padding: 10,
    borderRadius: 15,
    marginTop: 5,
  },
  linkText: {
    color: '#2B78E4',
    textDecorationLine: 'underline',
  },
});

export default AIChatComponent;
