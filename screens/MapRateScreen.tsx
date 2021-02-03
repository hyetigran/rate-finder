import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const { width, height } = Dimensions.get("window");

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
export default function MapRateScreen() {
  const [markers, setMarkers] = useState();
  const [region, setRegion] = useState<Region>({
    latitude: 40.181119,
    longitude: 44.514658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status! == "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this feature.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  useEffect(() => {});
  const getMarkers = () => {
    let data;
    setMarkers(data);
  };
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync();
      setRegion((prevState) => {
        return {
          ...prevState,
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
      });
    } catch (error) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or drag the map towards your current position.",
        [{ text: "Okay" }]
      );
    }
  };

  const changeRegionHandler = (region: Region) => {
    setRegion(region);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.floatButton}
        onPress={getLocationHandler}
      ></TouchableOpacity>
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
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 10,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});
