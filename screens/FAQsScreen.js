import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API_URL from '../backend/config/api';

const defaultFAQs = [
  {
    title: "App related questions:",
    questions: [
      {
        title: "How do I contact technician?",
        answer: "If you need technical assistance, our dedicated team is here to help. You can reach out to our technicians through multiple channels: Email us at support@example.com, call our technical support line, or use the in-app chat feature for immediate assistance. Our technicians are available Monday through Friday, 9 AM to 6 PM, and will respond to your query within 24 hours.",
        action: "Contact Support",
        actionType: "navigate",
        actionTarget: "ServiceForm"
      },
    ]
  },
  {
    title: "System related questions:",
    questions: [
      {
        title: "How to change password?",
        answer: "Changing your password is a simple process to help keep your account secure. Follow these steps:\n1. Go to your Account Settings\n2. Select the 'Security' tab\n3. Click on 'Change Password'\n4. Enter your current password\n5. Enter and confirm your new password\n6. Click 'Save Changes'\n\nRemember to choose a strong password that includes a mix of letters, numbers, and special characters.",
        action: "Change Password",
        actionType: "navigate",
        actionTarget: "EditPersonalDetails"
      }
    ]
  },
  {
    title: "Support related questions:",
    questions: [
      {
        title: "Contact number of LUXE",
        answer: "You can reach LUXE support at any time through our dedicated support line. Our team is ready to assist you with any questions or concerns you may have about our services or products. We aim to provide prompt and helpful assistance to ensure your complete satisfaction.",
        action: "Call Support",
        actionType: "call",
        actionTarget: "+61 0392406822"
      },
      {
        title: "Phone number",
        answer: "+61 0392406822",
      }
    ]
  }
];

const FAQsScreen = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [faqData, setFaqData] = useState(defaultFAQs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/support/faq`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setFaqData(data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Using default data.');
      setFaqData(defaultFAQs);
      setIsLoading(false);
    }
  };

  const handleAction = (actionType, actionTarget) => {
    switch (actionType) {
      case 'navigate':
        navigation.navigate(actionTarget);
        break;
      case 'call':
        Linking.openURL(`tel:${actionTarget}`);
        break;
      default:
        console.log('No action specified');
    }
  };

  const FAQSection = ({ title, questions }) => {
    const isExpanded = expandedSections.includes(title);
    
    const toggleSection = () => {
      setExpandedSections(prev => {
        if (isExpanded) {
          setExpandedQuestions(prevQuestions => 
            prevQuestions.filter(q => !questions.some(question => question.title === q))
          );
          return prev.filter(s => s !== title);
        } else {
          return [...prev, title];
        }
      });
    };

    return (
      <View style={[styles.faqSection, isExpanded && styles.faqSectionExpanded]}>
        <TouchableOpacity 
          style={[styles.faqSectionHeader, isExpanded && styles.faqSectionHeaderExpanded]}
          onPress={toggleSection}
        >
          <Text style={[styles.faqSectionTitle, isExpanded && styles.faqSectionTitleExpanded]}>{title}</Text>
          <Icon 
            name={isExpanded ? "minus" : "plus"} 
            size={24} 
            color="#87CEEB" 
          />
        </TouchableOpacity>
        <View style={styles.faqQuestions}>
          {questions.map((question, index) => (
            <FAQQuestion 
              key={index} 
              question={question}
              isVisible={isExpanded}
            />
          ))}
        </View>
      </View>
    );
  };

  const FAQQuestion = ({ question, isVisible }) => {
    const isExpanded = expandedQuestions.includes(question.title);
    
    const toggleQuestion = () => {
      setExpandedQuestions(prev => 
        isExpanded 
          ? prev.filter(q => q !== question.title)
          : [...prev, question.title]
      );
    };

    if (!isVisible) return null;

    return (
      <View style={styles.faqQuestion}>
        <TouchableOpacity 
          style={styles.faqQuestionHeader}
          onPress={toggleQuestion}
        >
          <Text style={styles.faqQuestionTitle}>{question.title}</Text>
          <Icon 
            name={isExpanded ? "minus" : "plus"} 
            size={20} 
            color="#FFD700"
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{question.answer}</Text>
            {question.action && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleAction(question.actionType, question.actionTarget)}
              >
                <Text style={styles.actionButtonText}>{question.action}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#87CEEB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {faqData.map((section, index) => (
            <FAQSection key={index} title={section.title} questions={section.questions} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
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
    fontWeight: '600',
  },
  faqQuestions: {
    marginTop: 8,
  },
  faqQuestion: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  faqQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#3A3A3A', 
  },
  faqQuestionTitle: {
    color: '#E0E0E0', 
    fontSize: 14,
    fontWeight: '500', 
    fontStyle: 'italic', 
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#87CEEB',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: 'bold',
  },
  faqSectionExpanded: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 8,
  },
  faqSectionHeaderExpanded: {
    backgroundColor: '#2C2C2C',
    marginBottom: 8,
  },
  faqSectionTitleExpanded: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FF0000',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FAQsScreen;

