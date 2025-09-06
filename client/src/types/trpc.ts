// Shared tRPC types for client-server communication
export interface TradingCardSet {
  id: number;
  name: string;
  year: string;
  sourceFile: string;
  sport: string;
}

export interface Card {
  id: number;
  cardNumber: number;
  playerName: string;
  cardType: string;
  setId: number;
}

export interface SetStats {
  set: TradingCardSet;
  totalCards: number;
  uniqueCardTypes: number;
  uniquePlayers: number;
  cardTypes: string[];
  players: string[];
}

// Define the AppRouter type based on the server implementation
export interface AppRouter {
  import: {
    input: { url: string };
    output: {
      success: boolean;
      cards: Card[];
      count: number;
      message: string;
    };
  };
  getSets: {
    input: void;
    output: TradingCardSet[];
  };
  getSetStats: {
    input: { setId: number };
    output: SetStats;
  };
}
