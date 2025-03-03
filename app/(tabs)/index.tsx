import React from "react";
import { AppRegistry } from "react-native";
import AppNavigator from "@/navigation/AppNavigator";
import appJson from "../../app.json"; // Import entire JSON file

const appName = appJson.expo.name; // Correct way to access name

const App = () => {
  return <AppNavigator />;
};

AppRegistry.registerComponent(appName, () => App);
export default App;
