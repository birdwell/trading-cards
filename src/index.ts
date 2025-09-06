import logger from "./logger";
import { importCardsFromUrl } from "./import-cards-from-url";

async function main() {
  const url = "https://www.beckett.com/news/2024-panini-prizm-football-cards/";
  const cards = await importCardsFromUrl(url);
  logger.info(`Retrieved ${cards.length} cards from database`);
}

await main();
