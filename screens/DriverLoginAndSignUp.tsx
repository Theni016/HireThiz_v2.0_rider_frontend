import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessPopup from "@/components/SuccessPopup";
import { RootStackParamList } from "../screens/types";

// Define the type for useNavigation
type DriverLoginNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "DriverMenu"
>;

const DriverLoginAndSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const navigation = useNavigation<DriverLoginNavProp>();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.8.140:5000/api/driver/signup",
        {
          email,
          password,
          vehicle,
          phoneNumber,
          username,
        }
      );
      setSuccessPopupVisible(true);
    } catch (error: any) {
      console.error("Sign-up error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Sign-up failed");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.8.140:5000/api/driver/login",
        {
          email,
          password,
        }
      );

      await AsyncStorage.setItem("token", response.data.token); // Store token

      // Fetch user details after login
      const profileResponse = await axios.get(
        "http://192.168.8.140:5000/api/driver/profile",
        {
          headers: { Authorization: response.data.token },
        }
      );

      await AsyncStorage.setItem("user", JSON.stringify(profileResponse.data)); // Store user details

      navigation.navigate("DriverMenu");
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? "Driver Login" : "Driver Sign Up"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={username}
          onChangeText={setUsername}
        />
      )}

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Vehicle Model"
          value={vehicle}
          onChangeText={setVehicle}
        />
      )}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}

      {/* Navigate to DriverMenu on button click */}
      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignUp}
      >
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>

      <SuccessPopup
        visible={successPopupVisible}
        onClose={() => setSuccessPopupVisible(false)}
        message="Sign-up successful! You can now log in."
      />
    </View>
  );
};

export default DriverLoginAndSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 300,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    width: 200,
    padding: 15,
    margin: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 20,
    color: "#007bff",
  },
});
