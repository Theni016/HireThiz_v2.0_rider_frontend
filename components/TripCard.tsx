import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import ConfirmPopup from "./ConfirmPopup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Trip = {
  _id: string;
  startLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  seatsAvailable: number;
  pricePerSeat: number;
  date: string;
  description: string;
  driverName: string;
  vehicle: string;
  rating: number;
  status?: "Available" | "In Progress" | "Completed" | "Cancelled";
};

interface TripCardProps {
  trip: Trip;
  onEdit?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const [selectedStatus, setSelectedStatus] = useState<
    "Available" | "In Progress" | "Completed" | "Cancelled"
  >(trip.status || "Available");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "Available" | "In Progress" | "Completed" | "Cancelled" | ""
  >("");

  const navigation = useNavigation<any>();

  const toggleTooltip = () => {
    if (showTooltip) {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowTooltip(false));
    } else {
      setShowTooltip(true);
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "#FFA500";
      case "Completed":
        return "#32CD32";
      case "Cancelled":
        return "#FF4747";
      case "Available":
        return "#1E90FF";
      default:
        return "#ccc";
    }
  };

  const extractDistrict = (address: string): string => {
    const parts = address.split(",").map((part) => part.trim());
    return parts[parts.length - 2] || parts[0];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusConfirm = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `http://192.168.8.140:3000/api/trips/${trip._id}/status`,
        { status: pendingStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowConfirmation(false);
      if (pendingStatus) {
        setSelectedStatus(pendingStatus);
      }
      Alert.alert("Success", `Trip status updated to ${pendingStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      Alert.alert("Error", "Could not update trip status");
    }
  };

  const effectiveStatus = pendingStatus || selectedStatus;

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.card}>
        <Text style={styles.tripTitle}>
          {extractDistrict(trip.startLocation.address)} →{" "}
          {extractDistrict(trip.destination.address)}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Seats:</Text>
          <Text style={styles.value}>{trip.seatsAvailable}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Price/Seat:</Text>
          <Text style={styles.value}>Rs. {trip.pricePerSeat}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(trip.date)}</Text>
        </View>

        <Text style={styles.description}>{trip.description}</Text>

        <View
          style={{
            backgroundColor: getStatusColor(effectiveStatus),
            borderRadius: 8,
            marginVertical: 10,
            overflow: "hidden",
          }}
        >
          <Picker
            selectedValue={effectiveStatus}
            onValueChange={(itemValue: any) => {
              if (itemValue !== selectedStatus) {
                setPendingStatus(itemValue);
                setShowConfirmation(true);
              }
            }}
            style={{
              color: "#fff",
              backgroundColor: getStatusColor(effectiveStatus),
              fontWeight: "bold",
            }}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Available" value="Available" />
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Completed" value="Completed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>

        <View style={styles.divider} />

        <Text style={styles.driver}>
          Driver: {trip.driverName} | {trip.vehicle} | ⭐ {trip.rating}
        </Text>

        <View style={styles.buttonRow}>
          <LinearGradient
            colors={["#ff6f61", "#d72638"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={toggleTooltip}
              style={styles.innerButton}
            >
              <Text style={styles.buttonText}>More Info</Text>
            </TouchableOpacity>
          </LinearGradient>
          {showTooltip && (
            <Animated.View
              style={[styles.tooltipContainer, { opacity: tooltipOpacity }]}
            >
              <TouchableOpacity
                style={styles.tooltipButton}
                onPress={() => {
                  setShowTooltip(false);
                  navigation.navigate("DriverViewBookings", {
                    tripId: trip._id,
                  });
                }}
              >
                <Text style={styles.tooltipText}>View Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tooltipButton}
                onPress={() => {
                  setShowTooltip(false);
                  console.log("Send Announcements Pressed");
                  // Navigate to Send Announcements screen if needed
                }}
              >
                <Text style={styles.tooltipText}>Send Announcements</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <LinearGradient
            colors={
              effectiveStatus === "In Progress"
                ? ["#4CAF50", "#388E3C"]
                : ["#888", "#666"]
            }
            style={styles.gradientButton}
          >
            <TouchableOpacity
              disabled={effectiveStatus !== "In Progress"}
              onPress={() =>
                navigation.navigate("NavigationScreen", {
                  startLocation: trip.startLocation,
                  destination: trip.destination,
                })
              }
              style={styles.innerButton}
            >
              <Text style={styles.buttonText}>View Navigation</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>

      <ConfirmPopup
        visible={showConfirmation}
        onConfirm={handleStatusConfirm}
        onCancel={() => setShowConfirmation(false)}
        message={`Are you sure you want to mark this trip as "${pendingStatus}"?`}
        icon={require("../assets/images/favicon.png")}
      />
      {showConfirmation && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <TouchableOpacity onPress={handleStatusConfirm}>
            <Text style={{ color: "white", fontSize: 16 }}>Yes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  tripTitle: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#d3d3d3",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff50",
    marginVertical: 15,
  },
  driver: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  gradientButton: {
    borderRadius: 30,
    width: "48%",
  },
  innerButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  tooltipContainer: {
    position: "absolute",
    top: -40,
    left: 140,
    zIndex: 10,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    padding: 10,
    borderRadius: 10,
    borderColor: "#444",
    borderWidth: 1,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  tooltipButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
