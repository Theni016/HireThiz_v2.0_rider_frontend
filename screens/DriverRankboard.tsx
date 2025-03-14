import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Driver Rankboard</Text>
        </View>

        <FlatList
          data={rankboardData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.rankCard}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>#{index + 1}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.driverName}>{item.driver}</Text>
                <Text style={styles.vehicle}>{item.vehicle}</Text>
                <View style={styles.statsContainer}>
                  <Text style={styles.stat}>Trips: {item.trips}</Text>
                  <Text style={styles.stat}>Stars: {item.stars}</Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={["#ff6f61", "#d72638"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Back to Menu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DriverRankboard;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  rankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff20",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffffff30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ff6f61",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rankBadgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  cardContent: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  vehicle: {
    fontSize: 16,
    color: "#ffffffaa",
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
