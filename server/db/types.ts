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
  isOwned?: boolean;
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

export interface SetStats {
  set: TradingCardSet;
  totalCards: number;
  ownedCards: number;
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