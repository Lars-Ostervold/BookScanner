import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function HomeScreen({ navigation }) {
  const [bookCount, setBookCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState('');

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const auth = getAuth();
  const db = getFirestore();

  // 'currentUser' is a property of the auth object and does not have the fields
  // that we added to the user document in Firestore. We need to fetch the user
  // document from Firestore to get the username.
  const fetchUser = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      setUsername(userDoc.data().username); // Set the username
    } else {
      console.log('No such document!');
    }
  };
  fetchUser(); // Not sure if this is the best way to do this, but call function here

  useFocusEffect(
    React.useCallback(() => {
      const fetchBooks = async () => {
        const userId = auth.currentUser.uid;
        const querySnapshot = await getDocs(collection(db, `users/${userId}/books`));
        setBookCount(querySnapshot.size);
        const booksData = querySnapshot.docs.map(doc => doc.data());
        booksData.sort(() => Math.random() - 0.5); // Randomize the order of the books
        setBooks(booksData);
      };
  
      fetchBooks();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current.scrollTo({x: 0, animated: false});

      const interval = setInterval(() => {
        scrollRef.current.scrollTo({x: scrollX._value + 100, animated: true});
      }, 10);
  
      return () => clearInterval(interval);
    }, [])
  );


  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Sign In');
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>You have {bookCount} books in your library.</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.tile, styles.tile2]} onPress={() => navigation.navigate('Camera')}>
          <View style={styles.tileIconContainer}>
            <Icon name="camera" size={30} color="#FFF" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileText}>Add Book by Barcode</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tile, styles.tile3]} onPress={() => navigation.navigate('AddByISBN')}>
          <View style={styles.tileIconContainer}>
            <Icon name="search" size={30} color="#FFF" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileText}>Add Book by ISBN</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tile, styles.tile1]} onPress={() => navigation.navigate('User Library')}>
          <View style={styles.tileIconContainer}>
            <Ionicons name="library" size={30} color="#FFF" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileText}>Go to Library</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tile, styles.tile4]} onPress={handleLogout}>
          <View style={styles.tileIconContainer}>
            <Icon name="sign-out" size={30} color="#FFF" />
          </View>
          <View style={styles.tileTextContainer}>
            <Text style={styles.tileText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView 
        ref={scrollRef}
        horizontal 
        style={styles.bookScroll} 
        scrollEventThrottle={1} 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {books.map((book, index) => (
          <View key={index} style={styles.bookContainer}>
            <Image source={{ uri: book.thumbnail }} style={styles.bookCover} />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  bookScroll: {
    marginTop: 20,
  },
  bookContainer: {
    marginRight: 10,
  },
  bookCover: {
    width: 75,
    height: 110,
    borderColor: 'black', // Add a black border
    borderWidth: 1, // Set the border width
    borderRadius: 5, // Make the corners slightly rounded
  },
  bookTitle: {
    width: 100,
    fontSize: 12,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  tile: {
    width: '48%',
    height: 100,
    marginBottom: '4%',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  tile1: {
    backgroundColor: '#FFA07A',
  },
  tile2: {
    backgroundColor: '#20B2AA',
  },
  tile3: {
    backgroundColor: '#9370DB',
  },
  tile4: {
    backgroundColor: '#3CB371',
  },
  tileIconContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  tileTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  tileText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});