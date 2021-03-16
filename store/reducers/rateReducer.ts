import { FETCH_RATES, RateActionTypes } from "../types/rateTypes";
const initialState = {
  cash: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
      isBank: 0,
    },
  ],
  card: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
      isBank: 1,
    },
  ],
};

export const rateReducer = (state = initialState, action: RateActionTypes) => {
  switch (action.type) {
    case FETCH_RATES:
      return {
        ...state,
        cash: action.payload.Cash,
        card: action.payload.Card,
      };
    default:
      return state;
  }
};
