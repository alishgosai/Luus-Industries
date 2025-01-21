import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const defaultFAQs = [
  {
    title: "About LUUS",
    questions: [
      {
        title: "Where is LUUS located?",
        answer: "LUUS Industries is housed within a purpose-built facility in Melbourne's West. We are proudly committed to being the leading manufacturer and solutions provider of commercial catering equipment in Australia.",
        action: "View on Map",
        actionType: "link",
        actionTarget: "https://g.co/kgs/u5BMWpt"
      },
      {
        title: "Is LUUS featured on MasterChef Australia?",
        answer: "Yes! LUUS is proud to be featured on MasterChef Australia 2024, where our professional-grade equipment, including our signature woks, are used by contestants and chefs.",
      },
      {
        title: "What types of equipment does LUUS manufacture?",
        answer: "LUUS manufactures a wide range of commercial catering equipment including woks, cooktops, ovens, fryers, griddles, and specialized Asian cooking equipment. Our product range caters to various commercial kitchen needs with both Asian and Professional series.",
        action: "View Products",
        actionType: "navigate",
        actionTarget: "Browse"
      }
    ]
  },
  {
    title: "Service & Support",
    questions: [
      {
        title: "How do I book a service?",
        answer: "You can easily book a service through our website or by contacting our support team. Our qualified technicians are available to help maintain and repair your LUUS equipment.",
        action: "Book Service",
        actionType: "navigate",
        actionTarget: "ServiceForm"
      },
      {
        title: "How do I register my warranty?",
        answer: "Warranty registration can be completed online through our warranty registration portal. This ensures your LUUS equipment is properly documented and covered under our warranty terms.",
        action: "Register Warranty",
        actionType: "navigate",
        actionTarget: "HomeQR"
      },
      { title: "Where do I find my warranty information?",
        answer: "Warranty details can be found on warranty and products page, where you can find all the details regarding duration and type of warranty of the products.",
        action: "View Warranty",
        actionType: "navigate",
        actionTarget: "WarrantyAndProducts"
      },
      {
        title: "Where can I find spare parts?",
        answer: "LUUS provides a comprehensive range of spare parts for all our equipment. You can browse and order spare parts through our dedicated spare parts section.",
        action: "View Spare Parts",
        actionType: "navigate",
        actionTarget: "SpareParts"
      }
    ]
  },
  {
    title: "Product Information",
    questions: [
      {
        title: "What is special about LUUS Asian cooking equipment?",
        answer: "LUUS has been involved in Asian cuisine since our inception. Our Asian cooking equipment is designed with intricate knowledge of the demands of Asian cooking, addressing common frustrations Asian chefs experience. Our equipment ensures authentic cooking results with professional-grade durability.",
        action: "View Asian Range",
        actionType: "navigate",
        actionTarget: "AsianProducts"
      },
      {
        title: "Tell me about the Professional Range",
        answer: "The LUUS Professional Series is engineered with higher specifications and heavy-duty construction. Standing at 800mm in depth, these units are ideal for restaurants, hotels, and franchises looking for extra performance, reliability, and style in a compact footprint.",
        action: "View Professional Range",
        actionType: "navigate",
        actionTarget: "ProfessionalProducts"
      }
    ]
  },
  {
    title: "Contact Information",
    questions: [
      {
        title: "How can I contact LUUS?",
        answer: "You can reach our support team through multiple channels. We're here to assist with any questions about our products and services.",
        action: "Contact Support",
        actionType: "call",
        actionTarget: "+61 0392406822"
      },
      {
        title: "Where can I find LUUS on social media?",
        answer: "Stay updated with LUUS news and events by following us on social media. We're active on Facebook, Instagram, and LinkedIn.",
        action: "Follow Us",
        actionType: "link",
        actionTarget: "https://www.instagram.com/luusau?igsh=M2JocW1qbjFxOWhs"
      }
    ]
  }
];

const FAQsScreen = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const faqData = defaultFAQs;

  const handleAction = (actionType, actionTarget) => {
    switch (actionType) {
      case 'navigate':
        navigation.navigate(actionTarget);
        break;
      case 'call':
        Linking.openURL(`tel:${actionTarget}`);
        break;
      case 'link':
        Linking.openURL(actionTarget);
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
    backgroundColor: '#000000',
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
});

export default FAQsScreen;

