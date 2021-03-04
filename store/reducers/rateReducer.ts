import { FETCH_RATES, RateActionStates } from "../types/rateTypes";

export const rateReducer = (state = [], action: RateActionStates) => {
  switch (action.type) {
    case FETCH_RATES:
      return [];
    default:
      return state;
  }
};
