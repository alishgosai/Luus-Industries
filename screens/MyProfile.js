import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfile, logoutUser } from '../Services/userApi';
import NetInfo from "@react-native-community/netinfo";

const MyProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!isConnected) {
      setError('No internet connection. Please check your network settings.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserProfile();
      setUserData(data);
      console.log('User data fetched successfully:', data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      if (err.message === 'User ID not found') {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigation, isConnected]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleSignOut = async () => {
    try {
      await logoutUser();
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userData');
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.error('Error signing out:', err);
      Alert.alert('Sign Out Failed', 'Please try again.');
    }
  };

  const ProfileItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#87CEEB" />
      <Text style={styles.profileItemLabel}>{label}</Text>
      <Icon name="chevron-right" size={24} color="#87CEEB" />
    </TouchableOpacity>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.profileHeader}>
            <Image
              source={userData && userData.avatar ? { uri: userData.avatar } : require("../assets/images/person.png")}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{userData ? userData.name : 'Luxe Customer/User'}</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditPicture')}
            >
              <Text style={styles.editButtonText}>Edit Picture</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            <ProfileItem 
              icon="account" 
              label="Account Information" 
              onPress={() => navigation.navigate('AccountInformation', { accountInfo: userData ? userData.accountInfo : null })}
            />
            <ProfileItem 
              icon="shield-check" 
              label="Warranty & Products" 
              onPress={() => navigation.navigate('WarrantyAndProducts', { warrantyProducts: userData ? userData.warrantyProducts : null })}
            />
            <ProfileItem 
              icon="help-circle" 
              label="Help & Support" 
              onPress={() => navigation.navigate('HelpAndSupport')}
            />
            <ProfileItem 
              icon="frequently-asked-questions" 
              label="FAQs" 
              onPress={() => navigation.navigate('FAQs')}
            />
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Icon name="logout" size={24} color="#FFFFFF" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  profileContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileItemLabel: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
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

export default MyProfileScreen;

