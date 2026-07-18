import { CardsFromLLM } from "../db/types";
import { tradingCards } from "../db/service";
import logger from "../shared/logger";
import { getSetName } from "../utils/get-set-name";
import { Sport } from "../shared/types";

export type CreateCardsResult = {
  setId: number;
  setName: string;
  cards: Awaited<ReturnType<typeof tradingCards.cards.findBySetId>>;
  alreadyExisted: boolean;
};

function sourceFileName(filePath: string): string {
  return filePath.split("/").pop() || filePath;
}

/**
 * Returns the existing set for a source spreadsheet, if one was already imported.
 */
export async function findExistingSetByFilePath(
  filePath: string
): Promise<CreateCardsResult | null> {
  const fileName = sourceFileName(filePath);
  const existingSet = await tradingCards.sets.findBySourceFile(fileName);

  if (!existingSet) {
    return null;
  }

  logger.info(
    `Set already exists: ${existingSet.name} (ID: ${existingSet.id}). Skipping card creation.`
  );
  const existingCards = await tradingCards.cards.findBySetId(existingSet.id);
  return {
    setId: existingSet.id,
    setName: existingSet.name,
    cards: existingCards,
    alreadyExisted: true,
  };
}

/**
 * Creates trading cards and their associated set in the database.
 * If the source file was already imported, returns the existing set without recreating cards.
 */
export async function createCards(
  filePath: string,
  sport: Sport,
  cards: CardsFromLLM[]
): Promise<CreateCardsResult> {
  const existing = await findExistingSetByFilePath(filePath);
  if (existing) {
    return existing;
  }

  const fileName = sourceFileName(filePath);
  const setInfo = getSetName(fileName);
  const newSet = await tradingCards.sets.create({
    name: setInfo.name,
    year: setInfo.year,
    sourceFile: fileName,
    sport: sport,
  });

  logger.info(`Created new set: ${newSet.name} (ID: ${newSet.id})`);

  const cardsToInsert = cards.map((card) => ({
    ...card,
    setId: newSet.id,
  }));

  await tradingCards.cards.create(cardsToInsert);
  const savedCards = await tradingCards.cards.findBySetId(newSet.id);
  logger.info(`Saved ${savedCards.length} cards to database`);

  return {
    setId: newSet.id,
    setName: newSet.name,
    cards: savedCards,
    alreadyExisted: false,
  };
}
