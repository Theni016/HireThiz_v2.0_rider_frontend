import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types.js";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

const GetStarted = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      {/* Logo Image */}
      <Image
        source={require("../assets/images/dark_bg_rider.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <Text style={styles.text}>Welcome to HireThiz!</Text> */}
      <TouchableOpacity
        onPress={() => navigation.navigate("DriverLoginAndSignUp")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#ff6f61", "#d72638"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#210b0e",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    fontFamily: "",
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff6f61",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3, // adds shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
  },
});

export default GetStarted;
