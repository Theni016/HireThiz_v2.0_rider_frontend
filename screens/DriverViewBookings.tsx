import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import ConfirmPopup from "@/components/ConfirmPopup";

const DriverViewBookings = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { tripId } = route.params;

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassenger, setSelectedPassenger] = useState<any>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [tripPricePerSeat, setTripPricePerSeat] = useState(0);

  useEffect(() => {
    const fetchTripDetailsAndBookings = async () => {
      try {
        const tripRes = await axios.get(
          `http://192.168.8.140:3000/api/trips/${tripId}`
        );
        setTripPricePerSeat(tripRes.data.pricePerSeat);

        const bookingRes = await axios.get(
          `http://192.168.8.140:3000/api/trips/${tripId}/bookings`
        );
        setPassengers(bookingRes.data.passengers);
      } catch (error) {
        console.error("Error fetching trip or bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetailsAndBookings();
  }, [refresh]);

  const handleConfirmPayment = async (index: number) => {
    try {
      await axios.put(
        `http://192.168.8.140:3000/api/trips/${tripId}/bookings/${index}/payment`
      );
      setConfirmVisible(false);
      setRefresh(!refresh); // Refresh the data
    } catch (err) {
      console.error("Error confirming payment", err);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const totalPrice = item.seatsBooked * tripPricePerSeat;

    return (
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{index + 1}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>📞 {item.phone}</Text>
          <Text style={styles.seats}>
            Seats Booked: {item.seatsBooked || 1}
          </Text>
          <Text style={styles.seats}>Total Price: Rs. {totalPrice}</Text>
          <Text style={styles.paymentStatus}>
            Payment Status: {item.payment || "Pending"}
          </Text>
          {item.payment !== "Completed" && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setSelectedPassenger({ ...item, index, totalPrice });
                setConfirmVisible(true);
              }}
            >
              <Text style={styles.confirmBtnText}>Confirm Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Passenger Bookings</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={passengers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => navigation.goBack()}
      >
        <LinearGradient colors={["#ff6f61", "#d72638"]} style={styles.button}>
          <Text style={styles.buttonText}>Back to Trips</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Confirmation Popup */}
      <ConfirmPopup
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => handleConfirmPayment(selectedPassenger.index)}
        message={`By clicking confirm, you acknowledge that you've received Rs. ${selectedPassenger?.totalPrice} from ${selectedPassenger?.name}.`}
      />
    </LinearGradient>
  );
};

export default DriverViewBookings;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginTop: 40, marginBottom: 20 },
  title: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff20",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffffff30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff6f61",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  details: { flex: 1 },
  name: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  phone: {
    fontSize: 14,
    color: "#ccc",
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  seats: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    marginTop: "auto",
    marginBottom: 30,
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  confirmBtn: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paymentStatus: {
    marginTop: 5,
    fontWeight: "600",
    color: "#fff",
  },
});
