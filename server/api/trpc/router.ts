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
});

// Export type definition of API
export type AppRouter = typeof appRouter;
