import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TripCard from "@/components/TripCard";
import { LinearGradient } from "expo-linear-gradient";
type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

type Trip = {
  _id: string;
  startLocation: Location;
  destination: Location;
  seatsAvailable: number;
  pricePerSeat: number;
  date: string;
  description: string;
  driverName: string;
  vehicle: string;
  rating: number;
  status?: "Available" | "On Progress" | "Completed" | "Cancelled";
};

const DriverEditTrip = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverTrips = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated");
          return;
        }

        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const driverId = tokenPayload.id;

        const response = await axios.get(
          `http://192.168.8.140:3000/api/trips/driver/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrips(response.data);
      } catch (error) {
        console.error("Fetch trips error:", error);
        Alert.alert("Error", "Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverTrips();
  }, []);

  return (
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Your Created Trips</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.loader}
          />
        ) : trips.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noTripsText}>No trips found.</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20, // Give it room from top
  },
  loader: {
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  noTripsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "#ffffff",
  },
});

export default DriverEditTrip;
