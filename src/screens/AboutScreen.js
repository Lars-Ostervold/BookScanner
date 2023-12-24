import React from 'react';
import { View, Text, StyleSheet, Linking, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 

const AboutScreen = () => {
    return (
      <View style={styles.container}>
        <Entypo name="open-book" size={75} color="black" />
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
          You can view the source code{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/Lars-Ostervold/BookScanner')}>
            here
          </Text>.
        </Text>
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/tree-of-life.png')} style={styles.image} />
        </View>
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
    imageContainer: {
        marginTop: 50, // adjust this value to move the image down
      },
      image: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black',
      },
  });
  
  export default AboutScreen;