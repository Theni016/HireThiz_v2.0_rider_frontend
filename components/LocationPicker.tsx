import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

  const fetchAddressFromCoords = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      setLoading(true);
      const apiKey = "AIzaSyD6STY62xhctE62ldoy8H9s7SzcAxDo8d8";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.status === "OK") {
        return (
          response.data.results[0]?.formatted_address || "Unknown location"
        );
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
      setLoading(false);
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
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Select a Location</Text>

          <TextInput
            style={styles.input}
            placeholder="Selected location"
            placeholderTextColor="#ccc"
            value={selectedLocation?.address || ""}
            editable={false}
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
              size="large"
              color="#007bff"
              style={{ marginVertical: 10 }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (selectedLocation) {
                  onSelectLocation(selectedLocation);
                  onClose();
                } else {
                  alert("Please select a location.");
                }
              }}
              disabled={loading}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={["#ff6f61", "#d72638"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={["#ff6f61", "#d72638"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    width: 350,
    padding: 20,
    backgroundColor: "#000428",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  map: {
    width: "100%",
    height: 430,
    borderRadius: 15,
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#ffffff20",
    borderRadius: 30,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#ffffff30",
    textAlign: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});

export default LocationPicker;
