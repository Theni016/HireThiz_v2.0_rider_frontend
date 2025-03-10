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
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import SuccessPopup from "@/components/SuccessPopup";
import LocationPicker from "@/components/LocationPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

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

  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [locationType, setLocationType] = useState<"start" | "destination">(
    "start"
  );

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

      await axios.post("http://192.168.8.140:5000/api/createTrip", tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Trip successfully created!");
      navigation.navigate("DriverMenu");
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

      {/* Start Location Selection */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => openLocationPicker("start")}
      >
        <Text style={styles.buttonText}>
          {startLocation ? startLocation.address : "Select Start Location"}
        </Text>
      </TouchableOpacity>

      {/* Destination Selection */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => openLocationPicker("destination")}
      >
        <Text style={styles.buttonText}>
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
  locationButton: {
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
});
