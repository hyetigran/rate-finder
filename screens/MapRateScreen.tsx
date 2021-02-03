import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

const { width, height } = Dimensions.get("window");

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Markers {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  isOpen: boolean;
}
export default function MapRateScreen() {
  const [markers, setMarkers] = useState<Markers[]>();
  const [region, setRegion] = useState<Region>({
    latitude: 40.181119,
    longitude: 44.514658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  console.log("markers", markers);
  const colorScheme = useColorScheme();
  const color: string = Colors[colorScheme].tint;
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);

    if (result.permissions.location.status !== "granted") {
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
      <TouchableOpacity style={styles.floatButton} onPress={getLocationHandler}>
        <Ionicons size={30} color={color} name="locate" />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={changeRegionHandler}
      >
        {markers &&
          markers!.map((marker) => {
            return (
              <Marker
                key={marker.id}
                title={marker.name}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
              />
            );
          })}
      </MapView>
      <ActionSheet
        lat={region.latitude}
        lng={region.longitude}
        setMarkers={setMarkers}
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
    zIndex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    position: "absolute",
    top: 30,
    right: 10,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});
