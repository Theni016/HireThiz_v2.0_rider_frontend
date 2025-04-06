import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import polyline from "@mapbox/polyline";
import axios from "axios";

type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};

type ParamList = {
  NavigationScreen: {
    startLocation: LocationType;
    destination: LocationType;
  };
};

const NavigationScreen = () => {
  const route = useRoute<RouteProp<ParamList, "NavigationScreen">>();
  const navigation = useNavigation();
  const { startLocation, destination } = route.params;

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const OPENROUTE_API_KEY =
    "5b3ce3597851110001cf624806f92b59ab58453a854248cc97031ac7";

  useEffect(() => {
    setCurrentLocation({
      latitude: startLocation.latitude,
      longitude: startLocation.longitude,
    });
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentLocation) return;

      try {
        const res = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            coordinates: [
              [currentLocation.longitude, currentLocation.latitude],
              [destination.longitude, destination.latitude],
            ],
          },
          {
            headers: {
              Authorization: OPENROUTE_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const coords = polyline.decode(res.data.routes[0].geometry);
        const route = coords.map(([lat, lng]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoords(route);
      } catch (err) {
        console.error("Route fetch error:", err);
        Alert.alert("Error", "Could not fetch route.");
      } finally {
        setLoading(false);
      }
    };

    if (currentLocation) {
      fetchRoute();
    }
  }, [currentLocation]);

  if (!currentLocation || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000428" />
        <Text style={{ marginTop: 10, color: "#000428" }}>
          Getting your location & route...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={currentLocation} title="Your Location" />
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title="Destination"
        />
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#1E90FF"
          />
        )}
      </MapView>

      <View style={styles.footer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: {
    padding: 10,
    backgroundColor: "#000428",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NavigationScreen;
