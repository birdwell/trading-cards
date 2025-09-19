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
import { getBrand, normalizeBrand } from "../utils/get-brand";

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

    async update(id: number, data: { name?: string; sport?: string }): Promise<TradingCardSet | undefined> {
      const [updatedSet] = await db
        .update(sets)
        .set(data)
        .where(eq(sets.id, id))
        .returning();
      return updatedSet as TradingCardSet;
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

    async delete(cardId: number): Promise<boolean> {
      try {
        await db.delete(cards).where(eq(cards.id, cardId));
        return true;
      } catch (error) {
        throw new Error(`Failed to delete card: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
    try {
      const setInfo = await this.sets.findById(setId);
      if (!setInfo) {
        console.log(`Set with ID ${setId} not found`);
        return null;
      }

      const allCards = await this.cards.findBySetId(setId);
      console.log(`Found ${allCards.length} cards for set ${setId}`);

      const cardTypes = [...new Set(allCards.map((card: any) => card.cardType))];
      const players = [...new Set(allCards.map((card: any) => card.playerName))];
      const ownedCards = allCards.filter((card: any) => card.isOwned).length;

      const stats = {
        set: setInfo,
        totalCards: allCards.length,
        ownedCards,
        uniqueCardTypes: cardTypes.length,
        uniquePlayers: players.length,
        cardTypes,
        players: players.slice(0, 10), // Top 10 players for preview
      };

      console.log(`Stats for set ${setId}: ${ownedCards}/${allCards.length} owned`);
      return stats;
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

  // Brand-related operations
  async getBrandOverview() {
    try {
      const allSets = await this.sets.findAll();
      const brandMap = new Map<string, { sets: TradingCardSet[], stats: SetStats[] }>();

      // Group sets by brand
      for (const set of allSets) {
        const brand = normalizeBrand(getBrand(set.name));
        
        if (!brandMap.has(brand)) {
          brandMap.set(brand, { sets: [], stats: [] });
        }
        
        brandMap.get(brand)!.sets.push(set);
      }

      // Get stats for each set in each brand
      const brandOverview = [];
      for (const [brand, data] of brandMap.entries()) {
        const setsWithStats = [];
        let totalCards = 0;
        let totalOwnedCards = 0;

        for (const set of data.sets) {
          const stats = await this.getSetStats(set.id);
          if (stats) {
            setsWithStats.push({ set, stats });
            totalCards += stats.totalCards;
            totalOwnedCards += stats.ownedCards;
          }
        }

        brandOverview.push({
          brand,
          sets: setsWithStats,
          overallStats: {
            totalSets: data.sets.length,
            totalCards,
            totalOwnedCards,
            completionPercentage: totalCards > 0 ? Math.round((totalOwnedCards / totalCards) * 100) : 0
          }
        });
      }

      // Sort by brand name
      return brandOverview.sort((a, b) => a.brand.localeCompare(b.brand));
    } catch (error) {
      console.error("Error in getBrandOverview:", error);
      throw error;
    }
  }

  async getBrandDetails(brandName: string) {
    try {
      const allSets = await this.sets.findAll();
      const brandSets = allSets.filter(set => {
        const setBrand = normalizeBrand(getBrand(set.name));
        return setBrand.toLowerCase() === brandName.toLowerCase();
      });

      if (brandSets.length === 0) {
        return null;
      }

      const setsWithStats = [];
      let totalCards = 0;
      let totalOwnedCards = 0;

      for (const set of brandSets) {
        const stats = await this.getSetStats(set.id);
        if (stats) {
          setsWithStats.push({ set, stats });
          totalCards += stats.totalCards;
          totalOwnedCards += stats.ownedCards;
        }
      }

      // Group by year and sport for better organization
      const yearGroups = new Map<string, { basketball: any[], football: any[] }>();
      
      for (const setWithStats of setsWithStats) {
        const year = setWithStats.set.year;
        const sport = setWithStats.set.sport.toLowerCase();
        
        if (!yearGroups.has(year)) {
          yearGroups.set(year, { basketball: [], football: [] });
        }
        
        if (sport === 'basketball') {
          yearGroups.get(year)!.basketball.push(setWithStats);
        } else if (sport === 'football') {
          yearGroups.get(year)!.football.push(setWithStats);
        }
      }

      return {
        brand: normalizeBrand(getBrand(brandSets[0].name)),
        overallStats: {
          totalSets: brandSets.length,
          totalCards,
          totalOwnedCards,
          completionPercentage: totalCards > 0 ? Math.round((totalOwnedCards / totalCards) * 100) : 0
        },
        yearGroups: Array.from(yearGroups.entries())
          .map(([year, sports]) => ({ year, ...sports }))
          .sort((a, b) => b.year.localeCompare(a.year)) // Most recent first
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
