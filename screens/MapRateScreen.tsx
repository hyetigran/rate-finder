import * as React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";
import { GOOGLE_API_KEY } from "react-native-dotenv";

export default function MapRateScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <ActionSheet />
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
