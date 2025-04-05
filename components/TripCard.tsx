import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import ConfirmPopup from "./ConfirmPopup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

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
  status?: "Available" | "On Progress" | "Completed" | "Cancelled";
};

interface TripCardProps {
  trip: Trip;
  onEdit?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const [selectedStatus, setSelectedStatus] = useState<
    "Available" | "On Progress" | "Completed" | "Cancelled"
  >(trip.status || "Available");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "Available" | "On Progress" | "Completed" | "Cancelled" | ""
  >("");

  const navigation = useNavigation<any>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Progress":
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
      await axios.put(`http://192.168.8.140:3000/trips/${trip._id}/status`, {
        status: pendingStatus,
      });
      setSelectedStatus(pendingStatus as any);
    } catch (error) {
      console.error("Failed to update status:", error);
      Alert.alert("Error", "Failed to update trip status.");
    } finally {
      setShowConfirmation(false);
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
            <Picker.Item label="On Progress" value="On Progress" />
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
              onPress={() => console.log("Message Booked Passengers")}
              style={styles.innerButton}
            >
              <Text style={styles.buttonText}>Message Booked Passengers</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={
              effectiveStatus === "On Progress"
                ? ["#4CAF50", "#388E3C"]
                : ["#888", "#666"]
            }
            style={styles.gradientButton}
          >
            <TouchableOpacity
              disabled={effectiveStatus !== "On Progress"}
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

// ...styles remain unchanged

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
});
