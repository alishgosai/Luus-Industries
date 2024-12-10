import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyProfileScreen = () => {
  const navigation = useNavigation();

  const MenuItem = ({ icon, title, onPress, color = '#666' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      <Icon name="chevron-right" size={24} color={color} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/avatar-placeholder.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>Luxe Customer/User</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="account-details"
          title="Account Information"
          onPress={() => navigation.navigate('AccountInformation')}
        />
        <MenuItem
          icon="shield-check"
          title="Warranty & Products"
          onPress={() => navigation.navigate('WarrantyProducts')}
        />
        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <MenuItem
          icon="frequently-asked-questions"
          title="FAQs"
          onPress={() => navigation.navigate('FAQ')}
        />
        <MenuItem
          icon="logout"
          title="Sign Out"
          onPress={() => {/* Handle sign out */}}
          color="#FF4444"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#87CEEB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: '#87CEEB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#FFF',
  },
});

export default MyProfileScreen;