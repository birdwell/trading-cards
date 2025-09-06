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

export interface Set {
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
  set: Set;
}

export interface SetStats {
  set: Set;
  totalCards: number;
  uniqueCardTypes: number;
  uniquePlayers: number;
  cardTypes: string[];
  players: string[];
}
