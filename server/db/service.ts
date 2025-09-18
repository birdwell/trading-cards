import { db, sets, cards } from "./index";
import { eq, like, and } from "drizzle-orm";
import {
  CreateSetData,
  CreateCardData,
  Card,
  TradingCardSet,
  SetStats,
  CardWithSet,
} from "./types";

class TradingCardService {
  // TradingCardSet operations
  sets = {
    async create(data: CreateSetData): Promise<TradingCardSet> {
      const [set] = await db.insert(sets).values(data).returning();
      return set as TradingCardSet;
    },

    async findBySourceFile(
      sourceFile: string
    ): Promise<TradingCardSet | undefined> {
      const [set] = await db
        .select()
        .from(sets)
        .where(eq(sets.sourceFile, sourceFile));
      return set as TradingCardSet;
    },

    async findById(id: number): Promise<TradingCardSet | undefined> {
      const [set] = await db.select().from(sets).where(eq(sets.id, id));
      return set as TradingCardSet;
    },

    async findByName(name: string): Promise<TradingCardSet[]> {
      return (await db
        .select()
        .from(sets)
        .where(like(sets.name, `%${name}%`))) as TradingCardSet[];
    },

    async findAll(): Promise<TradingCardSet[]> {
      return (await db.select().from(sets)) as TradingCardSet[];
    },

    async findByYear(year: string): Promise<TradingCardSet[]> {
      return (await db
        .select()
        .from(sets)
        .where(eq(sets.year, year))) as TradingCardSet[];
    },

    async delete(id: number): Promise<boolean> {
      try {
        // First delete all cards in the set
        await db.delete(cards).where(eq(cards.setId, id));
        
        // Then delete the set
        await db.delete(sets).where(eq(sets.id, id));
        return true;
      } catch (error) {
        throw new Error(`Failed to delete set: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  };

  // Card operations
  cards = {
    async create(cardsData: CreateCardData[]) {
      if (cardsData.length === 0) {
        return [];
      }
      return await db.insert(cards).values(cardsData).returning();
    },

    async createSingle(cardData: CreateCardData) {
      const [card] = await db.insert(cards).values(cardData).returning();
      return card;
    },

    async findById(id: number) {
      const [card] = await db.select().from(cards).where(eq(cards.id, id));
      return card;
    },

    async findBySetId(setId: number) {
      return await db.select().from(cards).where(eq(cards.setId, setId));
    },

    async findBySetIdWithSet(setId: number): Promise<CardWithSet[]> {
      return (await db
        .select({
          id: cards.id,
          cardNumber: cards.cardNumber,
          playerName: cards.playerName,
          cardType: cards.cardType,
          setId: cards.setId,
          set: {
            id: sets.id,
            name: sets.name,
            year: sets.year,
            sourceFile: sets.sourceFile,
            sport: sets.sport,
          },
        })
        .from(cards)
        .innerJoin(sets, eq(cards.setId, sets.id))
        .where(eq(cards.setId, setId))) as CardWithSet[];
    },

    async findByPlayer(playerName: string) {
      return await db
        .select()
        .from(cards)
        .where(like(cards.playerName, `%${playerName}%`));
    },

    async findByPlayerExact(playerName: string) {
      return await db
        .select()
        .from(cards)
        .where(eq(cards.playerName, playerName));
    },

    async findByCardType(cardType: string) {
      return await db.select().from(cards).where(eq(cards.cardType, cardType));
    },

    async findByCardNumber(cardNumber: number) {
      return await db
        .select()
        .from(cards)
        .where(eq(cards.cardNumber, cardNumber));
    },

    async findAll() {
      return await db.select().from(cards);
    },

    async findAllWithSets(): Promise<CardWithSet[]> {
      return (await db.query.cards.findMany({
        with: {
          set: true,
        },
      })) as CardWithSet[];
    },

    async updateOwnership(cardId: number, isOwned: boolean) {
      const [updatedCard] = await db
        .update(cards)
        .set({ isOwned })
        .where(eq(cards.id, cardId))
        .returning();
      return updatedCard;
    },
  };

  // Combined operations
  async findCardsInSet(setId: number) {
    return await this.cards.findBySetId(setId);
  }

  async findPlayerCardsInSet(playerName: string, setId: number) {
    return await db
      .select()
      .from(cards)
      .where(
        and(eq(cards.setId, setId), like(cards.playerName, `%${playerName}%`))
      );
  }

  async getSetStats(setId: number): Promise<SetStats | null> {
    const setInfo = await this.sets.findById(setId);
    const allCards = await this.cards.findBySetId(setId);

    if (!setInfo) return null;

    const cardTypes = [...new Set(allCards.map((card: any) => card.cardType))];
    const players = [...new Set(allCards.map((card: any) => card.playerName))];

    return {
      set: setInfo,
      totalCards: allCards.length,
      uniqueCardTypes: cardTypes.length,
      uniquePlayers: players.length,
      cardTypes,
      players: players.slice(0, 10), // Top 10 players for preview
    };
  }

  async searchCards(query: string) {
    return await db
      .select()
      .from(cards)
      .where(like(cards.playerName, `%${query}%`));
  }
}

// Export singleton instance
export const tradingCards = new TradingCardService();

// Export class for testing
export { TradingCardService };
