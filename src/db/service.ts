import { db, sets, cards } from "./index";
import { eq, like, and } from "drizzle-orm";
import { CreateSetData, CreateCardData, Card, Set, SetStats } from "./types";

class TradingCardService {
  // Set operations
  sets = {
    async create(data: CreateSetData): Promise<Set> {
      const [set] = await db.insert(sets).values(data).returning();
      return set as Set;
    },

    async findBySourceFile(sourceFile: string): Promise<Set | undefined> {
      const [set] = await db
        .select()
        .from(sets)
        .where(eq(sets.sourceFile, sourceFile));
      return set as Set;
    },

    async findById(id: number): Promise<Set | undefined> {
      const [set] = await db.select().from(sets).where(eq(sets.id, id));
      return set as Set;
    },

    async findByName(name: string): Promise<Set[]> {
      return (await db
        .select()
        .from(sets)
        .where(like(sets.name, `%${name}%`))) as Set[];
    },

    async findAll(): Promise<Set[]> {
      return (await db.select().from(sets)) as Set[];
    },

    async findByYear(year: string): Promise<Set[]> {
      return (await db.select().from(sets).where(eq(sets.year, year))) as Set[];
    },
  };

  // Card operations
  cards = {
    async create(cardsData: CreateCardData[]) {
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

    async findBySetIdWithSet(setId: number): Promise<Card[]> {
      return (await db.query.cards.findMany({
        where: eq(cards.setId, setId),
        with: {
          set: true,
        },
      })) as Card[];
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

    async findAllWithSets(): Promise<Card[]> {
      return (await db.query.cards.findMany({
        with: {
          set: true,
        },
      })) as Card[];
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

    const cardTypes = [...new Set(allCards.map((card) => card.cardType))];
    const players = [...new Set(allCards.map((card) => card.playerName))];

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
