import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('Register');
  }
  
  const signIn = async () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;

        Alert.alert('Signed in!');
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
        if (errorCode === 'auth/user-disabled') {
          Alert.alert('Oops!', 'User has been disabled.');
          return;
        }
        if (errorCode === 'auth/user-not-found') {
          Alert.alert('Oops!', 'User not found.');
          return;
        }
        if (errorCode === 'auth/wrong-password') {
          Alert.alert('Oops!', 'Incorrect password.');
          return;
        }
      });
  };


  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={signIn} />
      </View>
      <View style={styles.footer}>
        <Text>Don't have an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Sign up</Text></Text>
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
  footerLink: {
    color: '#007BFF',
  },
});
