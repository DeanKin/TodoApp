import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const App = () => {

  const navigation = useNavigation();

  const handleLogin = () => {
    // Navigate to Home screen
    navigation.navigate("Home");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title} >Login Form</Text>
      <TextInput style={styles.input} placeholder='Email'/>
      <TextInput 
      style={styles.input} 
      placeholder='Password'
      secureTextEntry/>
      <TouchableOpacity 
      onPress={handleLogin} 
      style={styles.button} >
        <Text style={styles.buttontext} >Login</Text> 
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  buttontext: {
    color: "#FF0000",
    fontSize: 20,
  },
  button :{
    width: '80%',
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  }
  
});



export default App;
