import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, orderBy, limit, deleteDoc, doc, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';

export default function UserLibraryScreen() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [open, setOpen] = useState(false);
  const [sortOption, setSortOption] = useState('author_az');
  const [sortOptions, setSortOptions] = useState([
    { label: 'Sort Author A-Z', value: 'author_az' },
    { label: 'Sort Author Z-A', value: 'author_za' },
    { label: 'Sort Title A-Z', value: 'title_az' },
    { label: 'Sort Title Z-A', value: 'title_za' },
  ]);

  // Fetch books from Firestore
  const fetchBooks = useCallback(async () => {
    const auth = getAuth();
    const db = getFirestore();
    const userId = auth.currentUser.uid;
    
    // Create a query to fetch books from the user's collection
    const q = query(collection(db, `users/${userId}/books`), orderBy('authors'), orderBy('title'), limit(10000));
    
    // Execute the query and get the query snapshot
    const querySnapshot = await getDocs(q);
    
    // Extract the book data from the query snapshot
    let books = querySnapshot.docs.map(doc => doc.data());
    
    // Sort the books by authors and then by title
    books.sort((a, b) => {
      let comparison = 0;
    
      switch (sortOption) {
        case 'author_az':
          comparison = a.authors[0].split(' ').pop().localeCompare(b.authors[0].split(' ').pop());
          break;
        case 'author_za':
          comparison = b.authors[0].split(' ').pop().localeCompare(a.authors[0].split(' ').pop());
          break;
        case 'title_az':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'title_za':
          comparison = b.title.localeCompare(a.title);
          break;
      }
    
      // If authors or titles are the same, sort by the other field
      if (comparison === 0) {
        if (sortOption.startsWith('author')) {
          comparison = a.title.localeCompare(b.title);
        } else {
          comparison = a.authors[0].split(' ').pop().localeCompare(b.authors[0].split(' ').pop());
        }
      }
    
      return comparison;
    });
    
    // Set the books state with the fetched and sorted books
    setBooks(books);
  }, [sortOption]);

  //Fresh fetch of books when page loads, and when sort option changes
  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [sortOption, fetchBooks])
  );

  const deleteBook = async (isbn) => {
    const auth = getAuth();
    const db = getFirestore();
    const userId = auth.currentUser.uid;
  
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book from your library?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            const booksRef = collection(db, `users/${userId}/books`);
            const q = query(booksRef, where("isbn", "==", isbn));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            fetchBooks();
          } 
        }
      ]
    );
  };

  // Filter the books based on the search query, rerender when the search query changes
  useEffect(() => {
    setFilteredBooks(
      books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [books, searchQuery]);


  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <Text style={styles.title}>Your Library</Text>
        <DropDownPicker
          open = {open}
          value = {sortOption}
          items={sortOptions}
          setOpen={setOpen}
          setValue={setSortOption}
          setItems={setSortOptions}
          containerStyle={{ 
            height: 40, 
            width: 160,
          }}
          style={{ backgroundColor: '#fff', borderColor: '#33A8FF', borderWidth: 1, borderRadius: 20 }}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          dropDownStyle = {{ backgroundColor: '#fff', borderColor: '#33A8FF', borderWidth: 1, borderRadius: 20 }}
          onChangeItem={item => setSortOption(item.value)}
        />
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={30} color="#AF7AC5" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Title or Author"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthors}>{item.authors.join(', ')}</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Icon name="trash" size={30} color="red" onPress={() => deleteBook(item.isbn)} />
            </View>
          </View>
        )}
      />
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
    marginTop: 10,
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  thumbnail: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthors: {
    fontSize: 14,
    color: '#666',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 2000,
  },
  sortPicker: {
    height: 50,
    width: 170,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 40,
    borderColor: '#33A8FF',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
});