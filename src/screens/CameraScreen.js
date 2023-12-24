import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator, Animated} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  

  //Animation for the focus line
  const focusAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(focusAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(focusAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [focusAnim]);

  //Request permission to use camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //Function to add book to Firestore
  async function addBook(userId, book) {
    const db = getFirestore();
    await addDoc(collection(db, `users/${userId}/books`), book);
  }


  //Function to handle barcode scanning. Once barcode is scanned, 
  //it will fetch the book data from Google Books API and add it to the user's collection.
  //If the book already exists in the user's collection, it will display an alert.
  const [isLoading, setIsLoading] = useState(false);
  const handleBarCodeScanned = ({ type, data }) => {
    setIsLoading(true);
    setScanned(true);
    isbn = data;
    
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
            }).catch((error) => {
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const focusLine = {
    position: 'absolute',
    left: '3%',
    right: '3%',
    height: 2,
    backgroundColor: '#33A8FF',
    borderRadius: 1,
    top: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['10%', '90%'],
    }),
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.focusArea}>
        <Animated.View style={focusLine} />
      </View>

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      {!scanned && <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 50}}>Looking for barcode...</Text>}
      
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  //Loading indicator when book is being added to collection
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  //Rectangle on the screen to indicate optimal placement of barcode
  focusArea: {
    backgroundColor: 'transparent',
    borderColor: '#D3D3D3',
    borderWidth: 4,
    borderRadius: 10,
    borderStyle: 'solid',
    width: '40%',
    height: '15%', 
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '20%',
  },
});

export default CameraScreen;
 