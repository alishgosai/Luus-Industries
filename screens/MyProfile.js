import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <ScrollView style={styles.content}>
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
          <TouchableOpacity style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#87CEEB',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    padding: 16,
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
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF0000',
    borderRadius: 25,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyProfileScreen;

