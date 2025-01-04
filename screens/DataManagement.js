import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const DataManagement = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Data Management Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DataManagement;

