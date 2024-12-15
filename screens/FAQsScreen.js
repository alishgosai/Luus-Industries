import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FAQsScreen = () => {
  const navigation = useNavigation();
  const [expandedSection, setExpandedSection] = useState(null);

  const FAQSection = ({ title, questions }) => (
    <View style={styles.faqSection}>
      <TouchableOpacity 
        style={styles.faqSectionHeader}
        onPress={() => setExpandedSection(expandedSection === title ? null : title)}
      >
        <Text style={styles.faqSectionTitle}>{title}</Text>
        <Icon 
          name={expandedSection === title ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#87CEEB" 
        />
      </TouchableOpacity>
      {expandedSection === title && (
        <View style={styles.faqQuestions}>
          {questions.map((question, index) => (
            <TouchableOpacity key={index} style={styles.faqQuestion}>
              <Text style={styles.faqQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color="#87CEEB" />
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <FAQSection 
          title="App related questions:"
          questions={[
            "How do I contact technician?",
            "Where to find history details?",
          ]}
        />
        <FAQSection 
          title="System related questions:"
          questions={[
            "How to change password?",
          ]}
        />
        <FAQSection 
          title="Support related questions:"
          questions={[
            "Contact number of LUXE",
            "Phone number: +91 00000000",
          ]}
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="magnify" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="qrcode-scan" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chat" size={24} color="#87CEEB" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="account" size={24} color="#87CEEB" />
          <Text style={[styles.navText, styles.navTextActive]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  faqSection: {
    marginBottom: 16,
  },
  faqSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
  },
  faqSectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqQuestions: {
    marginTop: 8,
  },
  faqQuestion: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  faqQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#121212',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#87CEEB',
  },
  navText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  navTextActive: {
    color: '#87CEEB',
  },
});

export default FAQsScreen;

