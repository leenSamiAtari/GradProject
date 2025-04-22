import React, { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, StyleSheet , Keyboard, Text} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const AdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Replace with your backend admin login endpoint
      const response = await fetch('YOUR_API_URL/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success && data.user.role === 'ADMIN') {
        navigation.navigate('AdminDashboard'); // Navigate to dashboard
      } else {
        Alert.alert('Error', 'Invalid admin credentials!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <TouchableOpacity
    style={styles.container}
    activeOpacity={1}
    onPress={Keyboard.dismiss}
  >

<View style={styles.overlay}>
<Text style={styles.title}>Welcome, Admin !</Text>
<View style={styles.inputContainer}>
<MaterialIcons name="email" size={20} color="gray" style={styles.icon} />
<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  style={styles.input}
/>
</View>
<View style={styles.inputContainer}>
<MaterialIcons name="lock-outline" size={20} color="gray" style={styles.icon} />
<TextInput
  style={styles.input}
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>
</View>

<TouchableOpacity style={styles.button} onPress={handleLogin}>
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>
      
      
 
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
      backgroundColor: "#ffff",
      justifyContent: "center",
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
      
    },
    background: {
      flex: 1,
      width: '100%', // Ensures the image spans the entire width
      height: '100%', // Ensures the image spans the entire height
      backgroundColor:"#ffff"
    },
    title: {
      color:"#000",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: -90,
    },
    button: {
      backgroundColor: "#59B3F8",
      paddingVertical: 10,
      borderRadius: 15,
      width: "100%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    link: {
      marginTop: 20,
    },
    linkText: {
      fontSize: 16,
      color: "#007bff",
      textDecorationLine: "underline",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#ddd",
      borderRadius: 15,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      height: 40,
      color: "#333",
    },
    icon: {
      marginRight: 10,
    },
  });

export default AdminLogin;