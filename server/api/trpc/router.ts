import { z } from "zod";
import { router, procedure, protectedProcedure } from "./init";
import { importCardsFromUrl } from "../../core/import-cards-from-url";
import { tradingCards } from "../../db/service";
import logger from "../../shared/logger";

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
        const result = await importCardsFromUrl(input.url);

        if (!result) {
          throw new Error(
            "No cards were imported. Check that the Beckett page has a downloadable checklist."
          );
        }

        return {
          success: true,
          setId: result.setId,
          setName: result.setName,
          count: result.cards.length,
          alreadyExisted: result.alreadyExisted,
          message: result.alreadyExisted
            ? `${result.setName} was already imported (${result.cards.length} cards).`
            : `Imported ${result.cards.length} cards into ${result.setName}.`,
        };
      } catch (error) {
        logger.error(
          `Error importing cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to import cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getSets: procedure.query(async () => {
    try {
      const sets = await tradingCards.sets.findAll();
      logger.info(`Retrieved ${sets.length} sets`);
      return sets;
    } catch (error) {
      logger.error(
        `Error fetching sets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        `Failed to fetch sets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  getSetsWithStats: procedure.query(async ({ ctx }) => {
    try {
      const setsWithStats = await tradingCards.getSetsWithStats(ctx.userId);
      logger.info(`Retrieved ${setsWithStats.length} sets with stats`);
      return setsWithStats;
    } catch (error) {
      logger.error(
        `Error in getSetsWithStats: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        `Failed to fetch sets with stats: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  getSetStats: procedure
    .input(z.object({ setId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const stats = await tradingCards.getSetStats(input.setId, ctx.userId);
        if (!stats) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }
        return stats;
      } catch (error) {
        logger.error(
          `Error fetching set stats: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to fetch set stats: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
          message: `Successfully deleted set with ID ${input.setId}`,
        };
      } catch (error) {
        logger.error(
          `Error deleting set: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to delete set: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getSetWithCards: procedure
    .input(z.object({ setId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const [set, cards] = await Promise.all([
          tradingCards.sets.findById(input.setId),
          tradingCards.cards.findBySetId(input.setId, ctx.userId),
        ]);

        if (!set) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }

        logger.info(`Retrieved set ${input.setId} with ${cards.length} cards`);

        return {
          set,
          cards,
        };
      } catch (error) {
        logger.error(
          `Error fetching set with cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to fetch set with cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateCardOwnership: protectedProcedure
    .input(
      z.object({
        cardId: z.number(),
        isOwned: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        logger.info(
          `Updating card ${input.cardId} ownership to ${input.isOwned} for user ${ctx.userId}`
        );
        const updatedCard = await tradingCards.cards.updateOwnership(
          input.cardId,
          ctx.userId,
          input.isOwned
        );

        if (!updatedCard) {
          throw new Error(`Card with ID ${input.cardId} not found`);
        }

        logger.info(`Successfully updated card ${input.cardId} ownership`);
        return updatedCard;
      } catch (error) {
        logger.error(
          `Error updating card ownership: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to update card ownership: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateSet: procedure
    .input(
      z.object({
        setId: z.number(),
        name: z.string().min(1, "Set name is required"),
        sport: z.string().min(1, "Sport is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        logger.info(
          `Updating set ${input.setId} with name: ${input.name}, sport: ${input.sport}`
        );
        const updatedSet = await tradingCards.sets.update(input.setId, {
          name: input.name,
          sport: input.sport,
        });

        if (!updatedSet) {
          throw new Error(`Set with ID ${input.setId} not found`);
        }

        logger.info(`Successfully updated set ${input.setId}`);
        return updatedSet;
      } catch (error) {
        logger.error(
          `Error updating set: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to update set: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
          message: `Successfully deleted card with ID ${input.cardId}`,
        };
      } catch (error) {
        logger.error(
          `Error deleting card: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to delete card: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  duplicateBaseAsHolo: procedure
    .input(z.object({ setId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        logger.info(`Duplicating Base cards as Holo for set ${input.setId}`);
        const result = await tradingCards.duplicateBaseAsHolo(input.setId);
        logger.info(
          `Created ${result.created} Holo cards for set ${input.setId}`
        );
        return {
          success: true,
          created: result.created,
          skipped: result.skipped,
          message:
            result.created > 0
              ? `Added ${result.created} Holo card${result.created === 1 ? "" : "s"}.`
              : "No new Holo cards to add — they may already exist.",
        };
      } catch (error) {
        logger.error(
          `Error duplicating Base as Holo: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to duplicate Base as Holo: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getBrandOverview: procedure.query(async ({ ctx }) => {
    try {
      logger.info("Fetching brand overview");
      const brandOverview = await tradingCards.getBrandOverview(ctx.userId);
      logger.info(`Retrieved overview for ${brandOverview.length} brands`);
      return brandOverview;
    } catch (error) {
      logger.error(
        `Error fetching brand overview: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        `Failed to fetch brand overview: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  getBrandDetails: procedure
    .input(z.object({ brandName: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        logger.info(`Fetching details for brand: ${input.brandName}`);
        const brandDetails = await tradingCards.getBrandDetails(
          input.brandName,
          ctx.userId
        );

        if (!brandDetails) {
          throw new Error(`Brand '${input.brandName}' not found`);
        }

        logger.info(`Retrieved details for brand: ${input.brandName}`);
        return brandDetails;
      } catch (error) {
        logger.error(
          `Error fetching brand details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to fetch brand details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
