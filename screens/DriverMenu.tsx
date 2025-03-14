import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../screens/types";
import ProfileIcon from "../assets/images/profile.png";
import CreateTripIcon from "../assets/images/create_trip.png";
import EditTripIcon from "../assets/images/edit_trip.png";
import RankboardIcon from "../assets/images/rankboard.png";
import ChatIcon from "../assets/images/chatbot.png";
import LogoutIcon from "../assets/images/logout.png";

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 60) / 2;

type GetStartedNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

const DriverMenu = () => {
  const navigation = useNavigation<GetStartedNavProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("GetStarted");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      <Image
        source={require("../assets/images/dark_bg_rider.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Driver Menu</Text>

      <ScrollView contentContainerStyle={styles.tilesWrapper}>
        {/* Create Trip */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("DriverCreateTrip")}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]} // New blue gradient
            style={styles.tile}
          >
            <Image
              source={CreateTripIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Create Trip</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Edit Trip */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("DriverEditTrip")}
        >
          <LinearGradient
            colors={["#43e97b", "#38f9d7"]} // New green gradient
            style={styles.tile}
          >
            <Image
              source={EditTripIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Edit Trip</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* View Profile */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("DriverProfile")}
        >
          <LinearGradient
            colors={["#fa709a", "#fee140"]} // Pink-yellow gradient
            style={styles.tile}
          >
            <Image
              source={ProfileIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>View Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Rankboard */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("DriverRankboard")}
        >
          <LinearGradient
            colors={["#a18cd1", "#fbc2eb"]} // Purple-pink gradient
            style={styles.tile}
          >
            <Image
              source={RankboardIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Rankboard</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Chat with Thizzy */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("ThizzyScreen")}
        >
          <LinearGradient
            colors={["#fddb92", "#d1fdff"]} // Light yellow-blue gradient
            style={styles.tile}
          >
            <Image source={ChatIcon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.tileText}>Chat with Thizzy</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Logout Tile (Danger Button Style) */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={["#ff6f61", "#d72638"]} // Danger red gradient
            style={styles.tile}
          >
            <Image
              source={LogoutIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default DriverMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Poppins-Bold",
  },
  tilesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  tileWrapper: {
    marginBottom: 20,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    width: 60, // Adjust size based on your needs
    height: 60,
    marginBottom: 10,
  },
  tileText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  logo: {
    width: 250, 
    height: 150, 
    alignSelf: "center", 
    marginBottom: 30,
  },
});
