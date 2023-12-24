import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 


const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Entypo name="open-book" size={150} color="#fff" />
      <Text style={styles.text}>BookScanner</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    marginTop: 20,
    fontSize: 40, // Make the text larger
    paddingBottom: 40, // Add some extra space below the text
    fontWeight: 'bold', // Make the text bold
    fontFamily: 'Arial', // Change the font to Arial for a more modern look
    color: '#fff', // Purpleish
  },
});

export default SplashScreen;