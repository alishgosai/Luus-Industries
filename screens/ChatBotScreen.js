import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';

const ChatbotScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello I'm your Chat Assistant.</Text>
      </View>

      {/* Bot Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('./assets/bot-icon.png')}
          style={styles.botIcon}
        />
      </View>

      {/* Help Text */}
      <Text style={styles.helpText}>How can I Help You Today?</Text>

      {/* Option Buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <Image
            source={require('./assets/chatbot-icon.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.optionTitle}>Chat bot</Text>
          <Text style={styles.optionSubtitle}>Chat with our help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Image
            source={require('./assets/phone-icon.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.optionTitle}>Call us</Text>
          <Text style={styles.optionSubtitle}>Talk to our executive</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Chat with Bot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Chat with Person</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  botIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '40%',
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionContainer: {
    padding: 20,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#87CEEB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#000000',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ChatbotScreen;