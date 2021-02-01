import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";

const { width, height } = Dimensions.get("window");

export default function MapRateScreen() {
  const [markers, setMarkers] = useState();

  const getMarkers = () => {
    let data;
    setMarkers(data);
  };
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <ActionSheet getMarkers={getMarkers} />
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
    width,
    height,
  },
});
