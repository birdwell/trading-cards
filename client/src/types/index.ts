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
  isOwned: boolean;
}

export interface CardWithSet {
  id: number;
  cardNumber: number;
  playerName: string;
  cardType: string;
  setId: number;
  isOwned: boolean;
  set: TradingCardSet;
}

export interface SetWithStats {
  set: TradingCardSet;
  stats: {
    set: TradingCardSet;
    totalCards: number;
    ownedCards: number;
    uniqueCardTypes: number;
    uniquePlayers: number;
    cardTypes: string[];
    players: string[];
  };
}
