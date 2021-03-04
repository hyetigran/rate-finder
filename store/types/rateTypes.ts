interface BuySell {
  buy: number;
  sell: number;
}
export interface RateState {
  [key: string]: any;
  bankName: string;
  usd: BuySell;
  eur: BuySell;
  rub: BuySell;
  gbp: BuySell;
}
export interface RootState {
  rate: RateState;
}

export const FETCH_RATES = "FETCH_RATES";

interface getRatesAction {
  type: typeof FETCH_RATES;
  payload: RateState;
}

export type RateActionTypes = getRatesAction;
