import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";

type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
};

const LocationPicker: React.FC<Props> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // 🟢 Reverse geocoding function using Google API
  const fetchAddressFromCoords = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      setLoading(true); // Start loading
      const apiKey = "AIzaSyD6STY62xhctE62ldoy8H9s7SzcAxDo8d8";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.status === "OK") {
        const address =
          response.data.results[0]?.formatted_address || "Unknown location";
        return address;
      } else {
        console.error("Reverse Geocoding failed:", response.data);
        Alert.alert("Error", "Failed to fetch address from location.");
        return "Unknown location";
      }
    } catch (error) {
      console.error("Reverse Geocoding error:", error);
      Alert.alert("Error", "Could not fetch address.");
      return "Unknown location";
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSelectLocation = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    const address = await fetchAddressFromCoords(latitude, longitude);

    setSelectedLocation({
      latitude,
      longitude,
      address,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          onPress={(data, details = null) => {
            if (details) {
              setSelectedLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                address: data.description,
              });
            }
          }}
          query={{
            key: "AIzaSyD6STY62xhctE62ldoy8H9s7SzcAxDo8d8",
            language: "en",
          }}
          fetchDetails
          styles={{
            container: { width: "100%" },
            textInput: { padding: 10, borderWidth: 1, borderRadius: 5 },
          }}
        />

        <MapView
          style={styles.map}
          onPress={handleSelectLocation}
          initialRegion={{
            latitude: 6.9271,
            longitude: 79.8612,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.address}
            />
          )}
        </MapView>

        {loading && (
          <ActivityIndicator
            style={{ marginBottom: 10 }}
            size="large"
            color="#007bff"
          />
        )}

        <View style={styles.buttonContainer}>
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (selectedLocation) {
                onSelectLocation(selectedLocation);
                onClose(); // ✅ Close modal after selection
              } else {
                alert("Please select a location.");
              }
            }}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: "white" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  closeButton: { position: "absolute", top: 10, right: 10, padding: 10 },
  closeButtonText: { color: "red", fontSize: 16 },
  map: { flex: 1, marginVertical: 10 },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    margin: 5,
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    margin: 5,
  },
  cancelButtonText: { color: "white", textAlign: "center", fontSize: 16 },

  submitButtonText: { color: "white", textAlign: "center", fontSize: 16 },
});

export default LocationPicker;
