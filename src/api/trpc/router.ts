import { z } from 'zod';
import { router, procedure } from './init';
import { importCardsFromUrl } from '../../core/import-cards-from-url';
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
});

// Export type definition of API
export type AppRouter = typeof appRouter;
