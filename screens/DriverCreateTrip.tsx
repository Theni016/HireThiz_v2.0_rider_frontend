import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView, // Import ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import SuccessPopup from "@/components/SuccessPopup";
import LocationPicker from "@/components/LocationPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import tripsuccess from "../assets/images/car_success.png";
import triperror from "../assets/images/car_error.png";


// Define types for trip details
type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

type TripDetails = {
  startLocation: string;
  destination: string;
  seatsAvailable: string;
  pricePerSeat: string;
  date: string;
  description: string;
};

type RootStackParamList = {
  DriverCreateTrip: undefined;
  DriverMenu: undefined;
};

const CreateTrip = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, "DriverCreateTrip">
    >();

  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationType, setLocationType] = useState<"start" | "destination">(
    "start"
  );
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    startLocation: "",
    destination: "",
    seatsAvailable: "",
    pricePerSeat: "",
    date: "",
    description: "",
  });
  const [creationSuccessPopupVisible, setCreationSuccessPopupVisible] =
    useState(false);
  const [creationFailurePopupVisible, setCreationFailurePopupVisible] =
    useState(false);

  const openLocationPicker = (type: "start" | "destination") => {
    setLocationType(type);
    setModalVisible(true);
  };

  const handleLocationSelect = (location: Location) => {
    if (locationType === "start") {
      setStartLocation(location);
    } else {
      setDestination(location);
    }
    setModalVisible(false);
  };

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

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const driverId = tokenPayload.id;

      if (!driverId || !startLocation || !destination) {
        Alert.alert(
          "Error",
          "Please select both start and destination locations."
        );
        return;
      }

      if (
        !tripDetails.seatsAvailable ||
        !tripDetails.pricePerSeat ||
        !tripDetails.date
      ) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      const tripData = {
        driver: driverId,
        startLocation: {
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          address: startLocation.address,
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address,
        },
        seatsAvailable: tripDetails.seatsAvailable,
        pricePerSeat: tripDetails.pricePerSeat,
        date: tripDetails.date,
        description: tripDetails.description,
      };

      console.log("Sending trip data:", tripData);

      await axios.post("http://192.168.8.140:3000/api/createTrip", tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCreationSuccessPopupVisible(true);
      
    } catch (error) {
      console.error("Trip creation error:", error);
      setCreationFailurePopupVisible(true);
      
    }
  };

  const handleSuccessClosePopup = () => {
    setCreationSuccessPopupVisible(false);
    navigation.navigate("DriverMenu");
  };

  // ✅ Failure popup closes but stays on the screen
  const handleFailureClosePopup = () => {
    setCreationFailurePopupVisible(false);
  };

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create a New Trip</Text>

          {/* Start Location Selection */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => openLocationPicker("start")}
          >
            <Text style={styles.locationText}>
              {startLocation ? startLocation.address : "Select Start Location"}
            </Text>
          </TouchableOpacity>

          {/* Destination Selection */}
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => openLocationPicker("destination")}
          >
            <Text style={styles.locationText}>
              {destination ? destination.address : "Select Destination"}
            </Text>
          </TouchableOpacity>

          {/* Location Picker Modal */}
          <LocationPicker
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectLocation={handleLocationSelect}
          />

          <TextInput
            style={styles.input}
            placeholder="Seats Available"
            keyboardType="numeric"
            value={tripDetails.seatsAvailable}
            onChangeText={(text) => handleInputChange("seatsAvailable", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price Per Seat"
            keyboardType="numeric"
            value={tripDetails.pricePerSeat}
            onChangeText={(text) => handleInputChange("pricePerSeat", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={tripDetails.date}
            onChangeText={(text) => handleInputChange("date", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={tripDetails.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
            <Text style={styles.buttonText}>Create Trip</Text>
          </TouchableOpacity>

          {/* Success Popup */}
          <SuccessPopup
            visible={creationSuccessPopupVisible}
            icon={tripsuccess}
            onClose={handleSuccessClosePopup}
            message="Trip Listed Successfully!!"
          />

          {/* Failure Popup */}
          <SuccessPopup
            visible={creationFailurePopupVisible}
            icon={triperror}
            onClose={handleFailureClosePopup}
            message="Trip Listing Error!!"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    fontFamily: "Poppins-Regular",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#ff6f61",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#d72638",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  locationButton: {
    padding: 15,
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});

export default CreateTrip;
