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
import { StackNavigationProp } from "@react-navigation/stack";
import SuccessPopup from "@/components/SuccessPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Define type for trip details
type TripDetails = {
  startLocation: string;
  destination: string;
  seatsAvailable: string;
  pricePerSeat: string;
  date: string;
  description: string;
};

// Define navigation type
type RootStackParamList = {
  DriverCreateTrip: undefined;
  DriverMenu: undefined;
};

const CreateTrip = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, "DriverCreateTrip">
    >();

  const [tripDetails, setTripDetails] = useState<TripDetails>({
    startLocation: "",
    destination: "",
    seatsAvailable: "",
    pricePerSeat: "",
    date: "",
    description: "",
  });

  const [popupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (key: keyof TripDetails, value: string) => {
    setTripDetails({ ...tripDetails, [key]: value });
  };

  const handleCreateTrip = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      // Decode JWT token to extract driver ID
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decodes JWT payload
      const driverId = tokenPayload.id; // Extract driver ID

      if (!driverId) {
        Alert.alert("Error", "Driver ID missing");
        return;
      }

      // Include driverId in the request
      const tripData = { ...tripDetails, driver: driverId };

      const response = await axios.post(
        "http://192.168.1.2:5000/api/createTrip",
        tripData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPopupVisible(true);
    } catch (error) {
      console.error("Trip creation error:", error);
      Alert.alert("Error", "Failed to create trip");
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    navigation.navigate("DriverMenu");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Trip</Text>

      <TextInput
        style={styles.input}
        placeholder="Start Location"
        onChangeText={(text) => handleInputChange("startLocation", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        onChangeText={(text) => handleInputChange("destination", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Seats Available"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange("seatsAvailable", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price Per Seat"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange("pricePerSeat", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        onChangeText={(text) => handleInputChange("date", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={(text) => handleInputChange("description", text)}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
        <Text style={styles.buttonText}>Create Trip</Text>
      </TouchableOpacity>

      {/* Success Popup */}
      <SuccessPopup
        visible={popupVisible}
        onClose={handleClosePopup}
        message="Trip successfully created!"
      />
    </View>
  );
};

export default CreateTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
