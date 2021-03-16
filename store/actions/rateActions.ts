import axios from "axios";
import { Action } from "redux";
import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { GATEWAY_BASE_URL } from "@env";
import {
  FETCH_RATES,
  SORT_RATES,
  RateActionTypes,
  RateState,
  RootState as RState,
} from "../types/rateTypes";
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
    let bankCash: RateState[] = parsedResult.Item.Cash.filter(
      (el: RateState) => el.isBank === 1
    );
    let exchangeCash: RateState[] = parsedResult.Item.Cash.filter(
      (el: RateState) => el.isBank === 0
    );
    let bankCard: RateState[] = parsedResult.Item.Card;

    dispatch(fetchRates({ bankCash, bankCard, exchangeCash }));
  } catch (error) {
    console.log(error);
  }
};

const fetchRates = (rates: RState): RateActionTypes => {
  return {
    type: FETCH_RATES,
    payload: rates,
  };
};

export const sortRateList = (
  rates: RateState[],
  col: number,
  type: boolean
): RateActionTypes => {
  return {
    type: SORT_RATES,
    payload: rates,
  };
};

// UNUSED ACTIONS
// const getUserLocation = async () => {
//   const hasPermission = await verifyPermissions();

//   if (!hasPermission) {
//     return;
//   }

//   try {
//     const location = await Location.getCurrentPositionAsync();
//     await AsyncStorage.setItem("userLocation", JSON.stringify(location.coords));
//     return location;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const verifyPermissions = async () => {
//   const result = await Permissions.askAsync(Permissions.LOCATION);

//   if (result.permissions.location.status !== "granted") {
//     return false;
//   }
//   return true;
// };
