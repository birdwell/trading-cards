import { db, sets, cards, userCards } from "./index";
import { eq, like, and, sql } from "drizzle-orm";
import {
  CreateSetData,
  CreateCardData,
  Card,
  TradingCardSet,
  SetStats,
  CardWithSet,
} from "./types";
import { getBrand, normalizeBrand } from "../utils/get-brand";
import { baseCardTypeToHolo } from "../utils/base-card-type-to-holo";

function withOwnedFlag<T extends { id: number }>(
  row: T,
  ownedUserId: string | null
): T & { isOwned: boolean } {
  return {
    ...row,
    isOwned: Boolean(ownedUserId),
  };
}

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

    async update(
      id: number,
      data: { name?: string; sport?: string }
    ): Promise<TradingCardSet | undefined> {
      const [updatedSet] = await db
        .update(sets)
        .set(data)
        .where(eq(sets.id, id))
        .returning();
      return updatedSet as TradingCardSet;
    },

    async delete(id: number): Promise<boolean> {
      try {
        await db.delete(sets).where(eq(sets.id, id));
        return true;
      } catch (error) {
        throw new Error(
          `Failed to delete set: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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

    async findBySetId(setId: number, userId?: string | null): Promise<Card[]> {
      const rows = await db
        .select({
          id: cards.id,
          cardNumber: cards.cardNumber,
          playerName: cards.playerName,
          cardType: cards.cardType,
          setId: cards.setId,
          ownedUserId: userCards.userId,
        })
        .from(cards)
        .leftJoin(
          userCards,
          and(
            eq(userCards.cardId, cards.id),
            userId ? eq(userCards.userId, userId) : sql`false`
          )
        )
        .where(eq(cards.setId, setId));

      return rows.map((row) =>
        withOwnedFlag(
          {
            id: row.id,
            cardNumber: row.cardNumber,
            playerName: row.playerName,
            cardType: row.cardType,
            setId: row.setId,
          },
          row.ownedUserId
        )
      );
    },

    async findBySetIdWithSet(
      setId: number,
      userId?: string | null
    ): Promise<CardWithSet[]> {
      const rows = await db
        .select({
          id: cards.id,
          cardNumber: cards.cardNumber,
          playerName: cards.playerName,
          cardType: cards.cardType,
          setId: cards.setId,
          ownedUserId: userCards.userId,
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
        .leftJoin(
          userCards,
          and(
            eq(userCards.cardId, cards.id),
            userId ? eq(userCards.userId, userId) : sql`false`
          )
        )
        .where(eq(cards.setId, setId));

      return rows.map((row) =>
        withOwnedFlag(
          {
            id: row.id,
            cardNumber: row.cardNumber,
            playerName: row.playerName,
            cardType: row.cardType,
            setId: row.setId,
            set: row.set,
          },
          row.ownedUserId
        )
      ) as CardWithSet[];
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
      })) as unknown as CardWithSet[];
    },

    async updateOwnership(
      cardId: number,
      userId: string,
      isOwned: boolean
    ): Promise<Card | undefined> {
      const card = await this.findById(cardId);
      if (!card) {
        return undefined;
      }

      if (isOwned) {
        await db
          .insert(userCards)
          .values({ userId, cardId })
          .onConflictDoNothing();
      } else {
        await db
          .delete(userCards)
          .where(
            and(eq(userCards.cardId, cardId), eq(userCards.userId, userId))
          );
      }

      return {
        ...card,
        isOwned,
      };
    },

    async delete(cardId: number): Promise<boolean> {
      try {
        await db.delete(cards).where(eq(cards.id, cardId));
        return true;
      } catch (error) {
        throw new Error(
          `Failed to delete card: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  };

  // Combined operations
  async findCardsInSet(setId: number, userId?: string | null) {
    return await this.cards.findBySetId(setId, userId);
  }

  async findPlayerCardsInSet(playerName: string, setId: number) {
    return await db
      .select()
      .from(cards)
      .where(
        and(eq(cards.setId, setId), like(cards.playerName, `%${playerName}%`))
      );
  }

  /**
   * Lightweight set list stats: one SQL round-trip (set + card/owned counts).
   * Prefer this over calling getSetStats per set.
   */
  async getSetsWithStats(userId?: string | null) {
    const ownershipJoin =
      userId != null
        ? and(eq(userCards.cardId, cards.id), eq(userCards.userId, userId))
        : sql`false`;

    const rows = await db
      .select({
        id: sets.id,
        name: sets.name,
        year: sets.year,
        sourceFile: sets.sourceFile,
        sport: sets.sport,
        totalCards: sql<number>`count(${cards.id})::int`,
        ownedCards: sql<number>`count(${userCards.userId})::int`,
      })
      .from(sets)
      .leftJoin(cards, eq(cards.setId, sets.id))
      .leftJoin(userCards, ownershipJoin)
      .groupBy(sets.id, sets.name, sets.year, sets.sourceFile, sets.sport);

    return rows.map((row) => {
      const set: TradingCardSet = {
        id: row.id,
        name: row.name,
        year: row.year,
        sourceFile: row.sourceFile,
        sport: row.sport,
      };
      const totalCards = Number(row.totalCards);
      const ownedCards = Number(row.ownedCards);

      return {
        set,
        stats: {
          set,
          totalCards,
          ownedCards,
          uniqueCardTypes: 0,
          uniquePlayers: 0,
          cardTypes: [] as string[],
          players: [] as string[],
        },
      };
    });
  }

  async getSetStats(
    setId: number,
    userId?: string | null
  ): Promise<SetStats | null> {
    try {
      const setInfo = await this.sets.findById(setId);
      if (!setInfo) {
        return null;
      }

      const allCards = await this.cards.findBySetId(setId, userId);
      const cardTypes = [...new Set(allCards.map((card) => card.cardType))];
      const players = [...new Set(allCards.map((card) => card.playerName))];
      const ownedCards = allCards.filter((card) => card.isOwned).length;

      return {
        set: setInfo,
        totalCards: allCards.length,
        ownedCards,
        uniqueCardTypes: cardTypes.length,
        uniquePlayers: players.length,
        cardTypes,
        players: players.slice(0, 10),
      };
    } catch (error) {
      console.error(`Error in getSetStats for set ${setId}:`, error);
      throw error;
    }
  }

  async searchCards(query: string) {
    return await db
      .select()
      .from(cards)
      .where(like(cards.playerName, `%${query}%`));
  }

  /**
   * Copy Base (and Base-*) cards in a set to Holo / Holo-* counterparts.
   * Skips cards that already have a matching holo (same number + player + type).
   */
  async duplicateBaseAsHolo(setId: number) {
    const setInfo = await this.sets.findById(setId);
    if (!setInfo) {
      throw new Error(`Set with ID ${setId} not found`);
    }

    const existing = await this.cards.findBySetId(setId);
    const existingKeys = new Set(
      existing.map(
        (card) =>
          `${card.cardNumber}|${card.playerName}|${card.cardType}`
      )
    );

    const toCreate: CreateCardData[] = [];
    let skipped = 0;

    for (const card of existing) {
      const holoType = baseCardTypeToHolo(card.cardType);
      if (!holoType) continue;

      const key = `${card.cardNumber}|${card.playerName}|${holoType}`;
      if (existingKeys.has(key)) {
        skipped += 1;
        continue;
      }

      toCreate.push({
        cardNumber: card.cardNumber,
        playerName: card.playerName,
        cardType: holoType,
        setId,
      });
      existingKeys.add(key);
    }

    const created = await this.cards.create(toCreate);
    return {
      created: created.length,
      skipped,
      cards: created,
    };
  }

  // Brand-related operations
  async getBrandOverview(userId?: string | null) {
    try {
      const setsWithStats = await this.getSetsWithStats(userId);
      const brandMap = new Map<
        string,
        {
          sets: Array<{
            set: TradingCardSet;
            stats: { totalCards: number; ownedCards: number };
          }>;
          totalCards: number;
          totalOwnedCards: number;
        }
      >();

      for (const { set, stats } of setsWithStats) {
        const brand = normalizeBrand(getBrand(set.name));
        if (!brandMap.has(brand)) {
          brandMap.set(brand, {
            sets: [],
            totalCards: 0,
            totalOwnedCards: 0,
          });
        }

        const entry = brandMap.get(brand)!;
        entry.sets.push({
          set,
          stats: {
            totalCards: stats.totalCards,
            ownedCards: stats.ownedCards,
          },
        });
        entry.totalCards += stats.totalCards;
        entry.totalOwnedCards += stats.ownedCards;
      }

      return Array.from(brandMap.entries())
        .map(([brand, data]) => ({
          brand,
          sets: data.sets,
          overallStats: {
            totalSets: data.sets.length,
            totalCards: data.totalCards,
            totalOwnedCards: data.totalOwnedCards,
            completionPercentage:
              data.totalCards > 0
                ? Math.round((data.totalOwnedCards / data.totalCards) * 100)
                : 0,
          },
        }))
        .sort((a, b) => a.brand.localeCompare(b.brand));
    } catch (error) {
      console.error("Error in getBrandOverview:", error);
      throw error;
    }
  }

  async getBrandDetails(brandName: string, userId?: string | null) {
    try {
      const setsWithStats = (await this.getSetsWithStats(userId)).filter(
        ({ set }) =>
          normalizeBrand(getBrand(set.name)).toLowerCase() ===
          brandName.toLowerCase()
      );

      if (setsWithStats.length === 0) {
        return null;
      }

      let totalCards = 0;
      let totalOwnedCards = 0;
      for (const { stats } of setsWithStats) {
        totalCards += stats.totalCards;
        totalOwnedCards += stats.ownedCards;
      }

      const yearGroups = new Map<
        string,
        { basketball: typeof setsWithStats; football: typeof setsWithStats }
      >();

      for (const setWithStats of setsWithStats) {
        const year = setWithStats.set.year;
        const sport = setWithStats.set.sport.toLowerCase();

        if (!yearGroups.has(year)) {
          yearGroups.set(year, { basketball: [], football: [] });
        }

        if (sport === "basketball") {
          yearGroups.get(year)!.basketball.push(setWithStats);
        } else if (sport === "football") {
          yearGroups.get(year)!.football.push(setWithStats);
        }
      }

      return {
        brand: normalizeBrand(getBrand(setsWithStats[0].set.name)),
        overallStats: {
          totalSets: setsWithStats.length,
          totalCards,
          totalOwnedCards,
          completionPercentage:
            totalCards > 0
              ? Math.round((totalOwnedCards / totalCards) * 100)
              : 0,
        },
        yearGroups: Array.from(yearGroups.entries())
          .map(([year, sports]) => ({ year, ...sports }))
          .sort((a, b) => b.year.localeCompare(a.year)),
      };
    } catch (error) {
      console.error(`Error in getBrandDetails for ${brandName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const tradingCards = new TradingCardService();

// Export class for testing
export { TradingCardService };
