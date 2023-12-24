import React, { useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import SignInScreen from './src/screens/SignInScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import UserLibraryScreen from './src/screens/UserLibraryScreen';
import AddByISBNScreen from './src/screens/AddByISBNScreen';
import SplashScreen from './src/screens/SplashScreen';
import AboutScreen from './src/screens/AboutScreen';
import './src/services/FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const AuthStack = () => (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="Sign In" component={SignInScreen} options={{ title: 'Log In' }} />
      <Stack.Screen name="Register" component={RegistrationScreen} options={{ title: 'Register' }} />
    </Stack.Navigator>
  );

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          display: 'flex',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="barcode" color={color} size={size} />
          ),
          title: 'Add by Barcode',
        }} 
      />
      <Tab.Screen 
        name="User Library" 
        component={UserLibraryScreen} 
        options={{ 
          title: 'Your Library',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ 
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="info-circle" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );

  const MainStack = createStackNavigator();
  
  const MainStackScreen = () => (
    <MainStack.Navigator>
      <MainStack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false, title: 'Home' }} />
      <Stack.Screen name="AddByISBN" component={AddByISBNScreen} options={{ title: 'Add By ISBN' }} />
    </MainStack.Navigator>
  );

  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
  
      // Sleep for 2 seconds to show splash screen
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
  
      // Cleanup function
      return () => {
        unsubscribe();
        clearTimeout(timer);
      };
    });
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  

  return (
    <NavigationContainer>
      {user ? <MainStackScreen /> : <AuthStack />}
    </NavigationContainer>
  );
}


