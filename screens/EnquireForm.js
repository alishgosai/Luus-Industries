import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';

export default function FAQScreen() {
  const [expandedSection, setExpandedSection] = useState(null);

  const faqSections = [
    {
      title: "App related questions:",
      questions: [
        {
          question: "How do I contact a technician?",
          answer: "You can contact our technician through the support section"
        },
        {
          question: "Where to find history details?",
          answer: "History details can be found in your profile section"
        }
      ]
    },
    {
      title: "System related questions:",
      questions: [
        {
          question: "How to change the password?",
          answer: "Go to Settings > Security > Change Password"
        }
      ]
    },
    {
      title: "Support related questions:",
      questions: [
        {
          question: "Contact number of LUUS",
          answer: "Phone number: +61 00000000"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>

      {/* FAQ Sections */}
      <ScrollView style={styles.content}>
        {faqSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() =>
                setExpandedSection(
                  expandedSection === section.title ? null : section.title
                )
              }
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <ChevronDown
                color="#fff"
                size={20}
                style={[
                  styles.icon,
                  {
                    transform: [
                      { rotate: expandedSection === section.title ? '180deg' : '0deg' }
                    ]
                  }
                ]}
              />
            </TouchableOpacity>

            {expandedSection === section.title && (
              <View style={styles.questionsContainer}>
                {section.questions.map((item, qIndex) => (
                  <TouchableOpacity key={qIndex} style={styles.questionButton}>
                    <Text style={styles.questionText}>{item.question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    transition: '0.3s',
  },
  questionsContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  questionButton: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 14,
  },
});
