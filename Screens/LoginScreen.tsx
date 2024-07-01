import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Import the locally saved logo image
import company from '../assets/company.jpeg';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    const userData = await AsyncStorage.getItem(email);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.password === password) {
        navigation.navigate('Home');
      } else {
        alert('Invalid credentials');
      }
    } else {
      alert('No user found');
    }
  };

  return (
    <View style={styles.container}>
      {/* Use the locally imported image */}
      <Image
        source={company}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={styles.header}>Login Your Account</Text>
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
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor:'white'
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40, // Adjust as needed
  },
  formContainer: {
    width: '100%',
    maxWidth: 300, // Adjust width as needed
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

export default LoginScreen;
