import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DriverProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>

      {/* ✅ Space for Profile Picture */}
      <View style={styles.profilePicturePlaceholder}>
        <Text style={styles.profilePictureText}>Profile Picture</Text>
      </View>

      {/* ✅ Display Logged-in User Details */}
      {user ? (
        <>
          <Text style={styles.infoText}>👤 Name: {user.username}</Text>
          <Text style={styles.infoText}>📧 Email: {user.email}</Text>
          <Text style={styles.infoText}>📞 Phone: {user.phoneNumber}</Text>
          <Text style={styles.infoText}>🚖 Vehicle: {user.vehicle}</Text>
        </>
      ) : (
        <Text style={styles.infoText}>Loading user data...</Text>
      )}

      {/* ✅ Button to go back to Menu */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePictureText: {
    color: "#555",
    fontSize: 14,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    width: 200,
    padding: 15,
    marginTop: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
