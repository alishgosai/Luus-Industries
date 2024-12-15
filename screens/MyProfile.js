import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyProfileScreen = () => {
  const navigation = useNavigation();

  const ProfileItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#87CEEB" />
      <Text style={styles.profileItemLabel}>{label}</Text>
      <Icon name="chevron-right" size={24} color="#87CEEB" />
    </TouchableOpacity>
  );

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
              source={require('../assets/images/person.png')}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Luxe Customer/User</Text>
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
              onPress={() => navigation.navigate('AccountInformation')}
            />
            <ProfileItem 
              icon="shield-check" 
              label="Warranty & Products" 
              onPress={() => navigation.navigate('WarrantyAndProducts')}
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

          <TouchableOpacity style={styles.signOutButton}>
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
    padding: 16,
    marginTop: 20,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default MyProfileScreen;

