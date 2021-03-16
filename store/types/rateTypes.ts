interface BuySell {
  buy: number;
  sell: number;
}
export interface RateState {
  [key: string]: any;
  name: string;
  USD: BuySell;
  EUR: BuySell;
  RUB: BuySell;
  GBP: BuySell;
  isBank?: number;
  distance?: number;
}
export interface RootState {
  [key: string]: any;
  bankCash: RateState[];
  bankCard: RateState[];
  exchangeCash: RateState[];
}

export const FETCH_RATES = "FETCH_RATES";
export const SORT_RATES = "SORT_RATES";

interface getRatesAction {
  type: typeof FETCH_RATES;
  payload: RootState;
}

interface sortRatesAction {
  type: typeof SORT_RATES;
  payload: RateState[];
}
export type RateActionTypes = getRatesAction | sortRatesAction;
