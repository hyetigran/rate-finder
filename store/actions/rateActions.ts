import axios from "axios";
import { Action } from "redux";
import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";

import { GATEWAY_BASE_URL } from "@env";
import { FETCH_RATES, RateActionTypes, RateState } from "../types/rateTypes";

export const thunkGetRates = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  try {
    const result: any = await axios.get(GATEWAY_BASE_URL);
    let parsedResult = JSON.parse(result.data.body);
    dispatch(fetchRates(parsedResult.Item.Banks));
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
