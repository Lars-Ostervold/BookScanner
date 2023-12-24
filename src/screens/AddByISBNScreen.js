import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function AddBookScreen({ navigation }) {
  const [isbn, setISBN] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  async function addBook(userId, book) {
    const db = getFirestore();
    await addDoc(collection(db, `users/${userId}/books`), book);
  }

  const handleAddBook = () => {
    setIsLoading(true);

    fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn)
      .then(response => response.json())
      .then(async data => {
        const items = data.items;
        if (items) {
          const book = items[0];
          const volumeInfo = book.volumeInfo;
          const title = volumeInfo.title;
          const authors = volumeInfo.authors; // This is an array
          const description = volumeInfo.description;
          const categories = volumeInfo.categories; // This is an array
          const pageCount = volumeInfo.pageCount;
          const imageLinks = volumeInfo.imageLinks;

          // Add the book to Firestore
          const auth = getAuth();
          const userId = auth.currentUser.uid;
          const db = getFirestore();
          const booksRef = collection(db, `users/${userId}/books`);
          const q = query(booksRef, where('isbn', '==', isbn));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty){
            //The book already exists in the user's collection
            Alert.alert('This book already exists in your collection.')
            setIsLoading(false);
          } else {
            const bookData = {
              title,
              authors,
              description,
              categories,
              pageCount,
              thumbnail: imageLinks.thumbnail,
              isbn
            };
            addBook(userId, bookData).then(() => {
              Alert.alert(`"${bookData.title}" was added to your collection.`);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(error);
              Alert.alert('There was an error adding this book to your collection. First, make sure you are connected to the internet. If you are connected to the internet, try adding the book by the ISBN.')
              setIsLoading(false);
            });
          }
        } else {
          Alert.alert('No book found with this ISBN');
          setIsLoading(false);
        }
      });
    };
  

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>Add a Book</Text>
          <Text style={styles.label}>Enter the ISBN:</Text>
          <TextInput 
            style={styles.input} 
            value={isbn} 
            onChangeText={setISBN} 
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAddBook}>
            <Text style={styles.buttonText}>Add Book</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#AF7AC5', //Purpleish
    padding: 10,
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    alignSelf: 'center',
    width: '40%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});