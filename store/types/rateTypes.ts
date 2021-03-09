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
  isBank: number;
}
export interface RootState {
  rate: {
    [key: string]: any;
    card: RateState[];
    cash: RateState[];
  };
}

export const FETCH_RATES = "FETCH_RATES";

interface getRatesAction {
  type: typeof FETCH_RATES;
  payload: RateState;
}

export type RateActionTypes = getRatesAction;
