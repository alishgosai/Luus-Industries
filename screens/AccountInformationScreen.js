import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../backend/config/api';

const AccountInformationScreen = () => {
  const navigation = useNavigation();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Fetching account data...');
      const response = await fetch(`${API_URL}/user/user-profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account information');
      }

      const data = await response.json();
      console.log('Received account data:', data);
      setAccountData(data);
    } catch (err) {
      console.error('Error fetching account data:', err.message);
      setError(err.message);
      if (err.message === 'User ID not found') {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchAccountData();
    }, [fetchAccountData])
  );

  const handleEditPersonalDetails = () => {
    if (accountData) {
      navigation.navigate('EditPersonalDetails', { accountInfo: accountData });
    } else {
      Alert.alert('Error', 'Unable to edit details. Please try again later.');
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <Icon name={icon} size={24} color="#87CEEB" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#87CEEB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAccountData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Account Information</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={accountData && accountData.avatar ? { uri: accountData.avatar } : require('../assets/images/person.png')}
              style={styles.avatar}
            />
          </View>

          <View style={styles.infoContainer}>
            <InfoItem icon="account" label="Name" value={accountData?.name} />
            <InfoItem icon="calendar" label="Date of Birth" value={accountData?.accountInfo?.dateOfBirth} />
            <InfoItem icon="phone" label="Phone Number" value={accountData?.accountInfo?.phoneNumber} />
            <InfoItem icon="email" label="Email" value={accountData?.accountInfo?.email} />
            <InfoItem icon="lock" label="Password" value="********" />
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPersonalDetails}
          >
            <Text style={styles.editButtonText}>Edit Personal Details</Text>
          </TouchableOpacity>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    marginLeft: 15,
    fontSize: 14,
    color: '#87CEEB',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
 
export default AccountInformationScreen;

