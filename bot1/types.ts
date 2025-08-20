
export enum ActionType {
  LONG = 'LONG',
  SHORT = 'SHORT',
  NO_TRADE = 'NO_TRADE'
}

export interface AnalysisResult {
  action: ActionType;
  entry: string;
  stop_loss: string;
  take_profits: string[];
  confidence: number;
  accuracy_estimate: string;
  timeframe: string;
  indicators: {
    EMA20?: string;
    SMA30?: string;
    RSI?: string;
    MACD?: string;
    volume?: string;
    [key: string]: string | undefined;
  };
  orderbook_bias: {
    buy_pct: number;
    sell_pct: number;
  } | null;
  reasons: string[];
  note: string;
}
