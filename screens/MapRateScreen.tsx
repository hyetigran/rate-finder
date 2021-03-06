import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import { GOOGLE_API_KEY } from "@env";

import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { thunkGetRates } from "../store/actions/rateActions";
import { RateState, RootState } from "../store/types/rateTypes";

const { width, height } = Dimensions.get("window");
// Marker pin colors
const PRIMARY_RATE_COLOR = "#fc3a24",
  SECONDARY_RATE_COLOR = "#fc3a24",
  CLOSED_RATE_COLOR = "#bbc0c4";

interface SearchForm {
  isCard: boolean;
  isBuy: boolean;
  currency: string;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Markers {
  rate: string;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  isOpen: boolean;
  isBuy: boolean;
}

export default function MapRateScreen(props: {
  navigation: { navigate: (arg0: string) => void };
}) {
  const [markers, setMarkers] = useState<Markers[]>();
  const [region, setRegion] = useState<Region>({
    latitude: 40.181119,
    longitude: 44.514658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const rateData = useSelector((state: RootState) => {
    return state.rate.banks;
  });

  const dispatch = useDispatch();
  useEffect(() => {
    // Load exchange rates
    dispatch(thunkGetRates());
  }, []);

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

  const submitSearch = (searchForm: SearchForm) => {
    const { isBuy, isCard, currency } = searchForm;
    // Find best rate
    let buying = isBuy ? "buy" : "sell";
    const bestRate =
      rateData &&
      rateData
        .map((bank: RateState) => {
          console.log("bank in map", bank);
          let specificRate: number = bank[currency][buying];
          return { name: bank.bankName, rate: specificRate };
        })
        .reduce(
          (
            prev: { name: string; rate: number },
            current: { name: string; rate: number }
          ) => {
            if (isBuy) {
              return prev.rate > current.rate ? prev : current;
            } else {
              return prev.rate < current.rate ? prev : current;
            }
          },
          { name: "", rate: 0 }
        );
    if (!bestRate) {
      // Handle error if rate list fails to fetch/sort
      return;
    }
    // Call google places API for location
    fetchMarkers(bestRate, isCard, isBuy);
  };

  const fetchMarkers = async (
    bestRate: { name: string; rate: number },
    isCard: boolean,
    isBuy: boolean
  ) => {
    let type = isCard ? "atm" : "bank";
    let keyword = bestRate.name;

    try {
      let response: any = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=${type}&keyword=${keyword}&key=${GOOGLE_API_KEY}`
      );

      let results = response.data.results.map((place: any) => {
        let id = place.place_id;
        let name = place.name;
        let address = place.vicinity;
        let latitude = place.geometry.location.lat;
        let longitude = place.geometry.location.lng;
        let isOpen = place.opening_hours?.open_now || false;

        let marker = {
          id,
          name,
          address,
          latitude,
          longitude,
          isOpen,
          rate: bestRate.rate,
          isBuy: isBuy,
        };
        return marker;
      });

      setMarkers(results);
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "We were unable to fetch search results. Please try again later.",
        [{ text: "Okay" }]
      );
    }
  };

  // Unecessary to update region state when moving or resizing map
  const changeRegionHandler = (region: Region) => {
    setRegion(region);
  };

  const pinPressHandler = () => {};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatButton} onPress={getLocationHandler}>
        <Ionicons size={30} color={color} name="locate" />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        region={region}
        //onRegionChange={changeRegionHandler}
      >
        {markers &&
          markers!.map((marker) => {
            return (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor={PRIMARY_RATE_COLOR}
                tracksViewChanges={false}
                // onPress={pinPressHandler}
                onCalloutPress={() =>
                  props.navigation.navigate("BusinessDetailScreen", {
                    placeId: marker.id,
                  })
                }
              >
                <Callout>
                  <View>
                    <Text style={styles.calloutTitle}>
                      {`${marker.name} `}{" "}
                      <Ionicons
                        size={18}
                        color={color}
                        name="help-circle-outline"
                      />
                    </Text>
                    <Text>{`Rate to ${marker.isBuy ? "buy" : "sell"} AMD: ${
                      marker.rate
                    }`}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>
      <ActionSheet submitSearch={submitSearch} />
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
  calloutTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
