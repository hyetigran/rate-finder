import axios from "axios";
import { Action } from "redux";
import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { GATEWAY_BASE_URL } from "@env";
import { FETCH_RATES, RateActionTypes, RateState } from "../types/rateTypes";
import { exchangeData } from "../../constants/GeoLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const thunkGetRates = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  try {
    const result: any = await axios.get(GATEWAY_BASE_URL);
    let parsedResult = JSON.parse(result.data.body);
    // let rates = parsedResult.Item;
    // let userLocation = await AsyncStorage.getItem("userLocation");
    // let userCoords;

    // if (userLocation == null) {
    //   let location = await getUserLocation();
    //   userCoords = {
    //     latitude: location!.coords.latitude,
    //     longitude: location!.coords.longitude,
    //   };
    // } else {
    //   let coordData = JSON.parse(userLocation);
    //   userCoords = {
    //     latitude: coordData.latitude,
    //     longitude: coordData.longitude,
    //   };
    // }

    dispatch(fetchRates(parsedResult.Item));
  } catch (error) {
    console.log(error);
  }
};

const fetchRates = (rates: RateState): RateActionTypes => {
  return {
    type: FETCH_RATES,
    payload: rates,
  };
};

const getUserLocation = async () => {
  const hasPermission = await verifyPermissions();

  if (!hasPermission) {
    return;
  }

  try {
    const location = await Location.getCurrentPositionAsync();
    await AsyncStorage.setItem("userLocation", JSON.stringify(location.coords));
    return location;
  } catch (error) {
    console.log(error);
  }
};

const verifyPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.LOCATION);

  if (result.permissions.location.status !== "granted") {
    return false;
  }
  return true;
};
