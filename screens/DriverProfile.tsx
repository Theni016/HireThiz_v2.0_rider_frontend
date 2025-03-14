import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Driver Profile</Text>

          <View style={styles.profilePicturePlaceholder}>
            <Image
              source={require("../assets/images/profilepic.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {user ? (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>👤 Name</Text>
                <Text style={styles.infoText}>{user.username}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>📧 Email</Text>
                <Text style={styles.infoText}>{user.email}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>📞 Phone</Text>
                <Text style={styles.infoText}>{user.phoneNumber}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>🚖 Vehicle</Text>
                <Text style={styles.infoText}>{user.vehicle}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.infoText, { color: "#fff" }]}>
              Loading user data...
            </Text>
          )}

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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    paddingTop: 40, // ✅ Add top padding to push everything down
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    // marginTop: 20, // ✅ Optional: use margin if not using SafeAreaView or paddingTop
  },
  profilePicturePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  profilePictureText: {
    color: "#555",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  infoCard: {
    backgroundColor: "#ffffff20",
    padding: 15,
    width: "100%",
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffffff30",
  },
  infoLabel: {
    fontSize: 16,
    color: "#ffffffaa",
    marginBottom: 5,
    fontFamily: "Poppins-Regular",
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
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
  logo: {
    width: 250,
    height: 150,
  },
});
