import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";

const { width, height } = Dimensions.get("window");

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
export default function MapRateScreen() {
  const [markers, setMarkers] = useState();
  const [region, setRegions] = useState<Region>({
    latitude: 40.181119,
    longitude: 44.514658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getMarkers = () => {
    let data;
    setMarkers(data);
  };

  const changeRegionHandler = (region: Region) => {
    setRegions(region);
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={changeRegionHandler}
      />
      <ActionSheet
        lat={region.latitude}
        lng={region.longitude}
        getMarkers={getMarkers}
      />
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
