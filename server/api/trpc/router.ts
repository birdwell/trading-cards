import { z } from 'zod';
import { router, procedure } from './init';
import { importCardsFromUrl } from '../../core/import-cards-from-url';
import { tradingCards } from '../../db/service';
import logger from '../../shared/logger';

export const appRouter = router({
  import: procedure
    .input(
      z.object({
        url: z.url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        logger.info(`tRPC import endpoint called with URL: ${input.url}`);
        const cards = await importCardsFromUrl(input.url);
        
        return {
          success: true,
          cards,
          count: cards.length,
          message: `Successfully imported ${cards.length} cards`
        };
      } catch (error) {
        logger.error(`Error importing cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to import cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getSets: procedure
    .query(async () => {
      try {
        const sets = await tradingCards.sets.findAll();
        logger.info(`Retrieved ${sets.length} sets`);
        return sets;
      } catch (error) {
        logger.error(`Error fetching sets: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to fetch sets: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getSetsWithStats: procedure
    .query(async () => {
      try {
        logger.info('Starting getSetsWithStats query');
        const sets = await tradingCards.sets.findAll();
        logger.info(`Found ${sets.length} sets, fetching stats for each`);
        
        const setsWithStats = await Promise.all(
          sets.map(async (set) => {
            try {
              logger.info(`Fetching stats for set ${set.id}: ${set.name}`);
              const stats = await tradingCards.getSetStats(set.id);
              return {
                set,
                stats: stats || {
                  set,
                  totalCards: 0,
                  ownedCards: 0,
                  uniqueCardTypes: 0,
                  uniquePlayers: 0,
                  cardTypes: [],
                  players: []
                }
              };
            } catch (setError) {
              logger.error(`Error fetching stats for set ${set.id}: ${setError instanceof Error ? setError.message : 'Unknown error'}`);
              // Return set with empty stats if individual set fails
              return {
                set,
                stats: {
                  set,
                  totalCards: 0,
                  ownedCards: 0,
                  uniqueCardTypes: 0,
                  uniquePlayers: 0,
                  cardTypes: [],
                  players: []
                }
              };
            }
          })
        );
        logger.info(`Successfully retrieved ${setsWithStats.length} sets with stats`);
        return setsWithStats;
      } catch (error) {
        logger.error(`Error in getSetsWithStats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        logger.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
        throw new Error(`Failed to fetch sets with stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getSetStats: procedure
    .input(z.object({ setId: z.number() }))
    .query(async ({ input }) => {
      try {
        const stats = await tradingCards.getSetStats(input.setId);
        if (!stats) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }
        return stats;
      } catch (error) {
        logger.error(`Error fetching set stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to fetch set stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  deleteSet: procedure
    .input(z.object({ setId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        logger.info(`Deleting set with ID: ${input.setId}`);
        const success = await tradingCards.sets.delete(input.setId);
        
        if (!success) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }
        
        logger.info(`Successfully deleted set with ID: ${input.setId}`);
        return {
          success: true,
          message: `Successfully deleted set with ID ${input.setId}`
        };
      } catch (error) {
        logger.error(`Error deleting set: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to delete set: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getSetWithCards: procedure
    .input(z.object({ setId: z.number() }))
    .query(async ({ input }) => {
      try {
        const set = await tradingCards.sets.findById(input.setId);
        if (!set) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }
        
        const cards = await tradingCards.cards.findBySetId(input.setId);
        logger.info(`Retrieved set ${input.setId} with ${cards.length} cards`);
        
        return {
          set,
          cards
        };
      } catch (error) {
        logger.error(`Error fetching set with cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to fetch set with cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  updateCardOwnership: procedure
    .input(z.object({ 
      cardId: z.number(),
      isOwned: z.boolean()
    }))
    .mutation(async ({ input }) => {
      try {
        logger.info(`Updating card ${input.cardId} ownership to ${input.isOwned}`);
        const updatedCard = await tradingCards.cards.updateOwnership(input.cardId, input.isOwned);
        
        if (!updatedCard) {
          throw new Error(`Card with ID ${input.cardId} not found`);
        }
        
        logger.info(`Successfully updated card ${input.cardId} ownership`);
        return updatedCard;
      } catch (error) {
        logger.error(`Error updating card ownership: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to update card ownership: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  updateSet: procedure
    .input(z.object({
      setId: z.number(),
      name: z.string().min(1, "Set name is required"),
      sport: z.string().min(1, "Sport is required")
    }))
    .mutation(async ({ input }) => {
      try {
        logger.info(`Updating set ${input.setId} with name: ${input.name}, sport: ${input.sport}`);
        const updatedSet = await tradingCards.sets.update(input.setId, {
          name: input.name,
          sport: input.sport
        });
        
        if (!updatedSet) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }
        
        logger.info(`Successfully updated set ${input.setId}`);
        return updatedSet;
      } catch (error) {
        logger.error(`Error updating set: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to update set: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  deleteCard: procedure
    .input(z.object({ cardId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        logger.info(`Deleting card with ID: ${input.cardId}`);
        const success = await tradingCards.cards.delete(input.cardId);
        
        if (!success) {
          throw new Error(`Card with ID ${input.cardId} not found`);
        }
        
        logger.info(`Successfully deleted card with ID: ${input.cardId}`);
        return {
          success: true,
          message: `Successfully deleted card with ID ${input.cardId}`
        };
      } catch (error) {
        logger.error(`Error deleting card: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to delete card: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getBrandOverview: procedure
    .query(async () => {
      try {
        logger.info('Fetching brand overview');
        const brandOverview = await tradingCards.getBrandOverview();
        logger.info(`Retrieved overview for ${brandOverview.length} brands`);
        return brandOverview;
      } catch (error) {
        logger.error(`Error fetching brand overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to fetch brand overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getBrandDetails: procedure
    .input(z.object({ brandName: z.string() }))
    .query(async ({ input }) => {
      try {
        logger.info(`Fetching details for brand: ${input.brandName}`);
        const brandDetails = await tradingCards.getBrandDetails(input.brandName);
        
        if (!brandDetails) {
          throw new Error(`Brand '${input.brandName}' not found`);
        }
        
        logger.info(`Retrieved details for brand: ${input.brandName}`);
        return brandDetails;
      } catch (error) {
        logger.error(`Error fetching brand details: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new Error(`Failed to fetch brand details: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
