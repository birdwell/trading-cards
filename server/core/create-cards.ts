import { CardsFromLLM } from "../db/types";
import { tradingCards } from "../db/service";
import logger from "../shared/logger";
import { getSetName } from "../utils/get-set-name";
import { Sport } from "../shared/types";

/**
 * Creates trading cards and their associated set in the database.
 * 
 * This function handles the complete workflow of creating trading cards:
 * 1. Extracts the filename from the provided file path
 * 2. Checks if a set already exists for this source file
 * 3. If set exists, skips creation and returns empty array
 * 4. If set doesn't exist, creates a new set with parsed name and year
 * 5. Associates all cards with the set and saves them to the database
 * 6. Returns the saved cards with complete set information
 * 
 * @param filePath - The full path to the source file containing card data
 * @param sport - The sport category for the trading cards (Sport enum value)
 * @param cards - Array of card data parsed from LLM processing
 * @returns Promise that resolves to an array of saved cards with set information,
 *          or empty array if the set already exists
 * 
 * @throws Will throw an error if database operations fail
 * 
 * @example
 * ```typescript
 * const cards = await createCards(
 *   "/path/to/1989-topps-basketball.json",
 *   Sport.Basketball,
 *   parsedCardData
 * );
 * ```
 */
export async function createCards(
  filePath: string,
  sport: Sport,
  cards: CardsFromLLM[]
) {
  const fileName = filePath.split("/").pop() || filePath;
  const existingSet = await tradingCards.sets.findBySourceFile(fileName);

  let setId: number;

  if (existingSet) {
    logger.info(
      `Set already exists: ${existingSet.name} (ID: ${existingSet.id}). Skipping card creation.`
    );
    return [];
  } else {
    const setInfo = getSetName(fileName);

    const newSet = await tradingCards.sets.create({
      name: setInfo.name,
      year: setInfo.year,
      sourceFile: fileName,
      sport: sport,
    });
    setId = newSet.id;

    logger.info(`Created new set: ${newSet.name} (ID: ${setId})`);
  }

  const cardsToInsert = cards.map((card) => ({
    ...card,
    setId,
  }));

  const savedCards = await tradingCards.cards.create(cardsToInsert);
  logger.info(`Saved ${savedCards.length} cards to database`);

  // Return cards with set information using efficient setId query
  const cardsWithSet = await tradingCards.cards.findBySetId(setId);
  return cardsWithSet;
}
