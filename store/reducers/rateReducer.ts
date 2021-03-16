import { FETCH_RATES, RateActionTypes } from "../types/rateTypes";
const initialState = {
  bankCash: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
    },
  ],
  bankCard: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
      isBank: 1,
    },
  ],
  exchangeCash: [
    {
      name: "",
      USD: { buy: 0, sell: 0 },
      EUR: { buy: 0, sell: 0 },
      GBP: { buy: 0, sell: 0 },
      RUB: { buy: 0, sell: 0 },
      isBank: 0,
    },
  ],
};

export const rateReducer = (state = initialState, action: RateActionTypes) => {
  switch (action.type) {
    case FETCH_RATES:
      let { bankCash, bankCard, exchangeCash } = action.payload;
      return {
        ...state,
        bankCard,
        bankCash,
        exchangeCash,
      };
    default:
      return state;
  }
};
