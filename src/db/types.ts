// Database entity creation interfaces
export interface CreateSetData {
  name: string;
  year: string;
  sourceFile: string;
  sport: string;
}

export interface CreateCardData {
  cardNumber: number;
  playerName: string;
  cardType: string;
  setId: number;
}

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

export interface CardWithSet {
  id: number;
  cardNumber: number;
  playerName: string;
  cardType: string;
  setId: number;
  set: TradingCardSet;
}

export interface SetStats {
  set: TradingCardSet;
  totalCards: number;
  uniqueCardTypes: number;
  uniquePlayers: number;
  cardTypes: string[];
  players: string[];
}

export interface CardsFromLLM {
  cardNumber: number;
  playerName: string;
  cardType: string;
}