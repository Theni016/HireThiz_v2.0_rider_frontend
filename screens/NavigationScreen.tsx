import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";

type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

type ParamList = {
  NavigationScreen: {
    startLocation: Location;
    destination: Location;
  };
};

const NavigationScreen = () => {
  const route = useRoute<RouteProp<ParamList, "NavigationScreen">>();
  const navigation = useNavigation();
  const { startLocation, destination } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        <Marker coordinate={startLocation} title="Start Location" />
        <Marker coordinate={destination} title="Destination" />
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
});

export default NavigationScreen;
