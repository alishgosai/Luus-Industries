import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MessageSquare, Phone, HelpCircle, MessageCircle, Search } from 'lucide-react-native';

export default function HelpAndSupport() {
  const navigation = useNavigation();

  const supportOptions = [
    {
      id: 'chatbot',
      title: 'Chat bot',
      subtitle: 'Chat with our Robo',
      icon: MessageSquare,
      onPress: () => navigation.navigate('Chatbot')
    },
    {
      id: 'callus',
      title: 'Call us',
      subtitle: 'Talk to our executive',
      icon: Phone,
      onPress: () => navigation.navigate('CallSupport')
    },
    {
      id: 'faqs',
      title: 'FAQs',
      subtitle: 'Discover app information',
      icon: HelpCircle,
      onPress: () => navigation.navigate('FAQs')
    },
    {
      id: 'feedback',
      title: 'Feedback',
      subtitle: 'Tell us what you think about our app',
      icon: MessageCircle,
      onPress: () => navigation.navigate('Feedback')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help And Support</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Support Options Grid */}
        <View style={styles.optionsGrid}>
          {supportOptions.slice(0, 2).map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={option.onPress}
            >
              <option.icon color="#000" size={24} />
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Large Cards */}
        {supportOptions.slice(2).map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.largeCard}
            onPress={option.onPress}
          >
            <option.icon color="#000" size={24} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#666" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search...."
            placeholderTextColor="#666"
          />
        </View>
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
    padding: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  largeCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTextContainer: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#000',
    fontSize: 16,
  },
});

