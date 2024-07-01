import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import company from '../assets/company.jpeg';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    const userData = await AsyncStorage.getItem(email);
    if (userData) {
      alert('User already exists');
    } else {
      const user = { name, email, password };
      await AsyncStorage.setItem(email, JSON.stringify(user));
      alert('User registered successfully');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
       <Image
        source={company}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.header}>Create Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginTop:10,marginBottom:10 }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'white'
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40, 
    alignSelf:'center'
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight:'bold',
    color:'#0A66C2'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal:8
  },
  passwordInput: {
    flex: 1,
  },
  icon: {
    padding: 8,
  },
  link: {
    color: 'blue',
  },
});

export default RegisterScreen;
