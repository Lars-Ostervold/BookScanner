import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About BookScanner</Text>
      <Text style={styles.text}>
        BookScanner is an open-source app designed to help you manage your book library. 
        You can add books to your library by scanning the book's barcode or manually entering the ISBN.
      </Text>
      <Text style={styles.text}>
        Once added, you can sort your books by title, author, or date added.
      </Text>
      <Text style={styles.text}>
        The code for BookScanner is licensed under the Apache License 2.0 and is available on GitHub. 
        You can view the source code {' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/yourusername/bookscanner')}>
          here
        </Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: 'blue',
  },
});

export default AboutScreen;