import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Trip = {
  id: number;
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
};

interface TripCardProps {
  trip: Trip;
  onEdit?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit }) => {
  const extractDistrict = (address: string): string => {
    if (!address) return "";

    const parts = address.split(",").map((part) => part.trim());

    if (parts.length >= 3) {
      return parts[parts.length - 2];
    }
    if (parts.length >= 2) {
      return parts[1];
    }
    return parts[0];
  };

  const startDistrict = extractDistrict(trip.startLocation.address);
  const destinationDistrict = extractDistrict(trip.destination.address);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  const formattedDate = formatDate(trip.date);

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.card}>
        <Text style={styles.tripTitle}>
          {startDistrict} → {destinationDistrict}
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
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        <Text style={styles.description}>{trip.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.driver}>
          Driver: {trip.driverName} | {trip.vehicle} | ⭐ {trip.rating}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#ff6f61", "#d72638"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Edit Trip</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
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
  editButton: {
    marginTop: 15,
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
