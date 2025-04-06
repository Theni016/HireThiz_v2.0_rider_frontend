import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GetStarted from "@/screens/GetStarted";
import DriverLoginAndSignUp from "@/screens/DriverLoginAndSignUp";
import DriverMenu from "@/screens/DriverMenu";
import DriverProfile from "@/screens/DriverProfile";
import DriverRankboard from "@/screens/DriverRankboard";
import ThizzyScreen from "@/screens/ThizzyScreen";
import DriverCreateTrip from "@/screens/DriverCreateTrip";
import DriverEditTrip from "@/screens/DriverEditTrip";
import NavigationScreen from "../screens/NavigationScreen";
import DriverViewBookings from "../screens/DriverViewBookings";
import { RootStackParamList } from "@/screens/types";

// Define stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [userToken, setUserToken] = useState<string | null>(null); // Token state

  // Check if the user is logged in (has a valid token)
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUserToken(token); // Set the token if it exists
      setLoading(false); // Stop loading
    };
    checkToken();
  }, []);

  // Show a loading indicator while checking the token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen
        name="DriverLoginAndSignUp"
        component={DriverLoginAndSignUp}
      />

      <Stack.Screen name="DriverMenu" component={DriverMenu} />
      <Stack.Screen name="DriverProfile" component={DriverProfile} />
      <Stack.Screen name="DriverRankboard" component={DriverRankboard} />
      <Stack.Screen name="ThizzyScreen" component={ThizzyScreen} />
      <Stack.Screen name="DriverCreateTrip" component={DriverCreateTrip} />
      <Stack.Screen name="DriverEditTrip" component={DriverEditTrip} />
      <Stack.Screen name="NavigationScreen" component={NavigationScreen} />

      <Stack.Screen name="DriverViewBookings" component={DriverViewBookings} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
