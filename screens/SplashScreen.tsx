import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Splash: undefined;
  GetStarted: undefined;
};

const SplashScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Splash">>();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("GetStarted");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HireThiz</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default SplashScreen;
