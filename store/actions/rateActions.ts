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
    const result = await axios.get(GATEWAY_BASE_URL);

    dispatch(fetchRates(result.items));
  } catch (error) {
    console.log(error);
  }
};

const fetchRates = (rates: RateState): RateActionTypes => {
  for (let i = 0; i < exam.questions.length; i++) {
    let shuffledAnswers = _(exam.questions[i].answers);
    exam.questions[i].answers = shuffledAnswers;
  }

  return {
    type: FETCH_EXAM,
    payload: exam,
  };
};
