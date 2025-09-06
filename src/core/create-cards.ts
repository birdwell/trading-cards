import { CardsFromLLM } from "../db/types";
import { tradingCards } from "../db/service";
import logger from "../shared/logger";
import { getSetName } from "../utils/get-set-name";

export async function createCards(
  filePath: string,
  sport: string,
  cards: CardsFromLLM[]
) {
  const fileName = filePath.split("/").pop() || filePath;
  const existingSet = await tradingCards.sets.findBySourceFile(fileName);

  let setId: number;

  if (existingSet) {
    logger.info(`Set already exists: ${existingSet.name} (ID: ${existingSet.id}). Skipping card creation.`);
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
  const cardsWithSet = await tradingCards.cards.findBySetIdWithSet(setId);
  return cardsWithSet;
}
