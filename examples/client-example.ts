import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import logger from "../server/shared/logger";
import { AppRouter } from "../server/api/trpc";

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

    const stream = await trpc.import.mutate({
      url: "https://www.beckett.com/news/2024-25-donruss-basketball-cards/",
    });

    for await (const event of stream) {
      if (event.type === "progress") {
        logger.info({ stage: event.stage }, "Import progress");
        continue;
      }

      if (event.type === "complete") {
        logger.info(
          {
            success: event.success,
            setId: event.setId,
            setName: event.setName,
            count: event.count,
            message: event.message,
          },
          "Import successful!"
        );
        continue;
      }

      const _exhaustive: never = event;
      throw new Error(`Unexpected import event: ${JSON.stringify(_exhaustive)}`);
    }
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
