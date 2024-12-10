import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountInformation = () => {
  const navigation = useNavigation();

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <Icon name={icon} size={24} color="#87CEEB" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/person.png')}
          style={styles.avatar}
        />
      </View>

      <View style={styles.infoContainer}>
        <InfoItem icon="account" label="Name" value="Luxe User" />
        <InfoItem icon="calendar" label="Date of Birth" value="21/09/2000" />
        <InfoItem icon="phone" label="Phone Number" value="941234567" />
        <InfoItem icon="email" label="Email" value="luxeuser@luxe.com" />
        <InfoItem icon="lock" label="Password" value="********" />
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditPersonalDetails')}
      >
        <Text style={styles.editButtonText}>Edit Personal Details</Text>
      </TouchableOpacity>
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
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    padding: 20,
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
    color: '#666',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#87CEEB',
    margin: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountInformation;