import "dotenv/config";
import ExcelJS from "exceljs";
import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { tradingCards } from "../db/service";
import { getSetName } from "../utils/get-set-name";
import logger from "../shared/logger";
import { Sport } from "../shared/types";
import { Card } from "../db/types";

const googleApiModel = google("models/gemini-1.5-flash-latest");

const cardSchema = z.object({
  cardNumber: z.number().int(),
  playerName: z.string(),
  cardType: z.string(),
});

const cardsSchema = z.array(cardSchema);

export default async function processCards(
  filePath: string,
  sport: Sport
): Promise<Card[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  let csvData = "";

  worksheet.eachRow((row) => {
    const rowData = row.values as ExcelJS.CellValue[];
    csvData += rowData.slice(1).join(",") + "\n";
  });

  const systemPrompt = `
    You are an expert at parsing sports card checklists.
    From the following data, extract the rows that are for the "${sport}".
    For each card, provide the card number, player name, and the type of card (e.g., "Base", "Rookie").
    The card type is usually in the first column.
    Output a JSON array of objects, each with keys: cardNumber (integer), playerName (string), cardType (string).
  `;

  const { object } = await generateObject({
    model: googleApiModel,
    system: systemPrompt,
    prompt: csvData,
    schema: cardsSchema,
  });

  if (object.length > 0) {
    const fileName = filePath.split("/").pop() || filePath;
    const existingSet = await tradingCards.sets.findBySourceFile(fileName);

    let setId: number;
    if (existingSet) {
      setId = existingSet.id;
      logger.info(`Using existing set: ${existingSet.name} (ID: ${setId})`);
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

    const cardsToInsert = object.map((card) => ({
      ...card,
      setId,
    }));

    const savedCards = await tradingCards.cards.create(cardsToInsert);
    logger.info(`Saved ${savedCards.length} cards to database`);

    // Return cards with set information using efficient setId query
    const cardsWithSet = await tradingCards.cards.findBySetIdWithSet(setId);
    return cardsWithSet;
  } else {
    logger.warn("No cards found for the specified sport.");
    return [];
  }
}
