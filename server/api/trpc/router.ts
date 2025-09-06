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
});

// Export type definition of API
export type AppRouter = typeof appRouter;
