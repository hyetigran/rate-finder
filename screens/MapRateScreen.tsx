import React, { useState, useEffect } from "react";
import axios from "axios";
import { StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GOOGLE_API_KEY } from "@env";
import ActionSheet from "../components/ActionSheet";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { thunkGetRates } from "../store/actions/rateActions";
import { RateState, RootState } from "../store/types/rateTypes";
import { addDistancePropertyToExchanges } from "../constants/CalcDistance";

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
  const allRateData = useSelector((state: RootState) => {
    return state.rate;
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
      await AsyncStorage.setItem(
        "userLocation",
        JSON.stringify(location.coords)
      );
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
    let rateData = isCard
      ? allRateData.bankCard
      : [...allRateData.bankCash, ...allRateData.exchangeCash];

    const sortedRates =
      rateData &&
      rateData
        .map((establishment: RateState) => {
          let specificRate: number = establishment[currency][buying];

          return { ...establishment, rate: specificRate };
        })
        .sort((a: { rate: number }, b: { rate: number }) => {
          if (isBuy) {
            return b.rate - a.rate;
          } else {
            return a.rate - b.rate;
          }
        });
    if (!sortedRates) {
      // Handle error if rate list fails to fetch/sort
      return;
    }
    // Call google places API for location
    fetchMarkers(sortedRates, isCard, isBuy);
  };

  const fetchMarkers = async (
    sortedRates: RateState[],
    isCard: boolean,
    isBuy: boolean
  ) => {
    let type = isCard ? "atm" : "bank";
    try {
      let results = [];
      let keyword = "";
      if (isCard) {
        let indexCard = 0;
        while (results.length < 15) {
          keyword = sortedRates[indexCard].name;
          let response: any = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=${type}&keyword=${keyword}&key=${GOOGLE_API_KEY}`
          );

          let result = response.data.results
            .filter((place: any) => {
              // Ensure results contain only keyword passed
              keyword = keyword.toLowerCase();
              keyword = keyword.replace("bank", "");
              keyword = keyword.replace("atm", "");
              keyword = keyword.trim();
              keyword = keyword.split(/[\s-]+/)[0];
              let lowerCaseName = place.name.toLowerCase();

              return lowerCaseName.includes(keyword);
            })
            .map((place: any) => {
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
                rate: sortedRates[indexCard].rate,
                isBuy: isBuy,
              };
              return marker;
            });
          results.push(...result);
          indexCard++;
        }
      } else {
        // Handle cash searches
        let indexCash = 0;
        // Add distance and coordinate properties to exchange rate
        let sortedRatesWithDistance = addDistancePropertyToExchanges(
          sortedRates,
          { latitude: region.latitude, longitude: region.longitude },
          true
        );
        while (results.length < 15) {
          if (sortedRatesWithDistance[indexCash].isBank === 0) {
            // Check distance on exchanges that have distance property and distance is less than 1.4km
            if (
              sortedRatesWithDistance[indexCash].distance !== undefined &&
              sortedRatesWithDistance[indexCash].distance! < 1.4
            ) {
              // Assign an ID for rendering
              sortedRatesWithDistance[indexCash]["id"] = indexCash;
              results.push(sortedRatesWithDistance[indexCash]);
            }
          } else if (sortedRatesWithDistance[indexCash].isBank === 1) {
            // fetch markers
            keyword = sortedRatesWithDistance[indexCash].name;
            let response: any = await axios.get(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=${type}&keyword=${keyword}&key=${GOOGLE_API_KEY}`
            );

            let result = response.data.results
              .filter((place: any) => {
                // Ensure results contain only keyword passed
                keyword = keyword.toLowerCase();
                keyword = keyword.replace("bank", "");
                keyword = keyword.replace("atm", "");
                keyword = keyword.trim();
                keyword = keyword.split(/[\s-]+/)[0];
                let lowerCaseName = place.name.toLowerCase();

                // Filter out place with ATM in name for "Cash" searches
                return (
                  lowerCaseName.includes(keyword) &&
                  !lowerCaseName.includes("atm")
                );
              })
              .map((place: any) => {
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
                  rate: sortedRates[indexCash].rate,
                  isBuy: isBuy,
                };
                return marker;
              });
            results.push(...result);
          }
          indexCash++;
        }
      }

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
        showsUserLocation={true}
        //onRegionChange={changeRegionHandler}
      >
        {markers &&
          markers!.map((marker) => {
            return (
              <Marker
                pointerEvents={"auto"}
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor={PRIMARY_RATE_COLOR}
                tracksViewChanges={false}
                // onPress={pinPressHandler}
                onCalloutPress={() => {
                  props.navigation.navigate("BusinessDetailScreen", {
                    placeId: marker.id,
                    titleName: marker.name,
                  });
                }}
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
