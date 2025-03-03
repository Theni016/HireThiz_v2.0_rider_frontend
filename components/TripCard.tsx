import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Trip = {
  id: number;
  startLocation: string;
  destination: string;
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
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.tripTitle}>
        {trip.startLocation} → {trip.destination}
      </Text>
      <Text style={styles.details}>
        Seats: {trip.seatsAvailable} | Price: Rs. {trip.pricePerSeat}
      </Text>
      <Text style={styles.details}>Date: {trip.date}</Text>
      <Text style={styles.description}>{trip.description}</Text>
      <Text style={styles.driver}>
        Driver: {trip.driverName} | Vehicle: {trip.vehicle} | ⭐ {trip.rating}
      </Text>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#777",
  },
  driver: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
