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

  const renderTile = (icon: any, label: string, onPress: () => void) => (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient colors={["#ff6f61", "#d72638"]} style={styles.tileButton}>
        <View style={styles.tileContent}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#000428", "#004e92"]} style={styles.container}>
      <Image
        source={require("../assets/images/dark_bg_rider.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Driver Menu</Text>

      <ScrollView contentContainerStyle={styles.tilesWrapper}>
        {renderTile(CreateTripIcon, "Create Trip", () =>
          navigation.navigate("DriverCreateTrip")
        )}
        {renderTile(EditTripIcon, "My Trips", () =>
          navigation.navigate("DriverEditTrip")
        )}
        {renderTile(ProfileIcon, "View Profile", () =>
          navigation.navigate("DriverProfile")
        )}
        {renderTile(RankboardIcon, "Rankboard", () =>
          navigation.navigate("DriverRankboard")
        )}
        {renderTile(ChatIcon, "Chat with Thizzy", () =>
          navigation.navigate("ThizzyScreen")
        )}

        {/* Logout Tile (Styled like 'Back to Menu') */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleLogout}>
          <LinearGradient
            colors={["#b00020", "#8e0016"]} // deeper red gradient
            style={[styles.tileButton]}
          >
            <View style={styles.tileContent}>
              <Image
                source={LogoutIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Log Out</Text>
            </View>
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
    paddingBottom: 30,
  },
  tileButton: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  tileContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#b00020",
    borderWidth: 1,
    borderColor: "#fff",
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
});
