import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function RegistrationScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 


  const onFooterLinkPress = () => {
    navigation.navigate('Sign In');
  }

  //Function to create a user in Firestore
  async function createUserDocument(user) {
    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: user.email,
      // any other user info you want to store
    });
  }

  const onRegisterPress = () => {
    const auth = getAuth();
    if (password !== confirmPassword) {
      Alert.alert('Error!', 'Passwords do not match.');
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        Alert.alert('Signed in!');

        //Creates a document in Firestore for the user
        createUserDocument(user)
        navigation.navigate('Home');

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //Catch firebase errors and display message user would understand
        if (errorCode === 'auth/invalid-email') {
          Alert.alert('Oops!', 'Invalid email address.');
          return;
        }
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Oops!', 'Email address already in use.');
          return;
        }
        if (errorCode === 'auth/weak-password') {
          Alert.alert('Oops!', 'Password must be at least 6 characters.');
          return;
        }
        if (errorCode === 'auth/operation-not-allowed') {
          Alert.alert('Oops!', 'Operation not allowed.');
          return;
        } 
        if (errorCode === 'auth/missing-password') {
          Alert.alert('Oops!', 'Please enter a password.');
          return;
        }
        if (errorCode === 'auth/missing-email') {
          Alert.alert('Oops!', 'Please enter an email address.');
          return;
        }
        if (errorCode === 'auth/invalid-credential') {
          Alert.alert('Oops!', 'Either your email or password is incorrect.');
          return;
        }
        else {
          Alert.alert('Oops!', errorMessage);
          return;
        }

      });
  }
  
  
  
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={setConfirmPassword} value={confirmPassword} secureTextEntry />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Sign In</Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  footerText: {
    color: '#333',
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
