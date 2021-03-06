import { FETCH_RATES, RateActionTypes } from "../types/rateTypes";
const initialState = {
  banks: [
    {
      bankName: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUS: { buy: 0, sell: 0 },
    },
  ],
  nonBanks: [
    {
      nonBankName: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUS: { buy: 0, sell: 0 },
    },
  ],
};

export const rateReducer = (state = initialState, action: RateActionTypes) => {
  switch (action.type) {
    case FETCH_RATES:
      console.log("fire reducer");
      return {
        ...state,
        banks: action.payload,
      };
    default:
      return state;
  }
};
