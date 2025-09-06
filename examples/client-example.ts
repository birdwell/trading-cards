import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import logger from "../server/shared/logger";
import { AppRouter } from "../server/api/trpc";
;

// Create the tRPC client
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3002",
    }),
  ],
});

async function testImportEndpoint() {
  try {
    logger.info("Testing tRPC import endpoint...");

    const result = await trpc.import.mutate({
      url: "https://www.beckett.com/news/2024-25-donruss-basketball-cards/",
    });

    logger.info(
      {
        success: result.success,
        count: result.count,
        message: result.message,
        sampleCards: result.cards.slice(0, 3), // Show first 3 cards
      },
      "Import successful!"
    );
  } catch (error) {
    logger.error(
      error instanceof Error ? error : new Error(String(error)),
      "Import failed"
    );
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testImportEndpoint();
}
