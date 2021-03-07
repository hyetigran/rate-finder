import { FETCH_RATES, RateActionTypes } from "../types/rateTypes";
const initialState = {
  banks: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
    },
  ],
  nonBanks: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
    },
  ],
};

export const rateReducer = (state = initialState, action: RateActionTypes) => {
  switch (action.type) {
    case FETCH_RATES:
      return {
        ...state,
        banks: action.payload,
      };
    default:
      return state;
  }
};
