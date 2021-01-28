import * as React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";

import { Text, View } from "../components/Themed";

export default function MapRateScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
