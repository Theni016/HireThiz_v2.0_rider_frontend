import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Hardcoded Rankboard Data
const rankboardData = [
  {
    id: "1",
    driver: "Alex Smith",
    vehicle: "Toyota Prius",
    trips: "120",
    stars: "4.8⭐",
  },
  {
    id: "2",
    driver: "John Doe",
    vehicle: "Honda Civic",
    trips: "95",
    stars: "4.5⭐",
  },
  {
    id: "3",
    driver: "Sarah Lee",
    vehicle: "Tesla Model 3",
    trips: "80",
    stars: "4.7⭐",
  },
  {
    id: "4",
    driver: "Michael Brown",
    vehicle: "Ford Focus",
    trips: "70",
    stars: "4.3⭐",
  },
];

const DriverRankboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Rankboard</Text>

      {/* Rankboard Table */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Driver</Text>
        <Text style={styles.headerText}>Vehicle</Text>
        <Text style={styles.headerText}>Trips</Text>
        <Text style={styles.headerText}>Stars</Text>
      </View>

      <FlatList
        data={rankboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{item.driver}</Text>
            <Text style={styles.rowText}>{item.vehicle}</Text>
            <Text style={styles.rowText}>{item.trips}</Text>
            <Text style={styles.rowText}>{item.stars}</Text>
          </View>
        )}
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverRankboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rowText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
