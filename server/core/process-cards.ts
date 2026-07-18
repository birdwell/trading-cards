import "dotenv/config";
import ExcelJS from "exceljs";
import { generateObject } from "ai";
import { z } from "zod";
import logger from "../shared/logger";
import { Sport } from "../shared/types";
import { CardsFromLLM } from "../db/types";
import { createCards, CreateCardsResult } from "./create-cards";
import {
  createGeminiModel,
  GEMINI_MODEL_UNAVAILABLE_MESSAGE,
  isGeminiModelUnavailableError,
} from "./gemini-model";

const cardSchema = z.object({
  cardNumber: z.number().int(),
  playerName: z.string(),
  cardType: z.string(),
});

const cardsSchema = z.array(cardSchema);

export async function readSpreadsheetAsCsv(filePath: string): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  let csvData = "";

  worksheet.eachRow((row) => {
    const rowData = row.values as ExcelJS.CellValue[];
    csvData += rowData.slice(1).join(",") + "\n";
  });

  return csvData;
}

export async function extractCardsWithLlm(
  csvData: string,
  sport: Sport
): Promise<CardsFromLLM[]> {
  const systemPrompt = `
    You are an expert at parsing sports card checklists.
    From the following data, extract the rows that are for the "${
      sport == Sport.Basketball ? "Oklahoma City Thunder" : "Dallas Cowboys"
    }".
    For each card, provide the card number, player name, and the type of card (e.g., "Base", "Rookie").
    The card type is usually in the first column.
    Output a JSON array of objects, each with keys: cardNumber (integer), playerName (string), cardType (string).
  `;

  const { object: cards } = await generateObject({
    model: createGeminiModel(),
    system: systemPrompt,
    prompt: csvData,
    schema: cardsSchema,
  }).catch((error) => {
    if (isGeminiModelUnavailableError(error)) {
      throw new Error(GEMINI_MODEL_UNAVAILABLE_MESSAGE);
    }

    throw error;
  });

  return cards;
}

export default async function processCards(
  filePath: string,
  sport: Sport
): Promise<CreateCardsResult | null> {
  const csvData = await readSpreadsheetAsCsv(filePath);
  const cards = await extractCardsWithLlm(csvData, sport);

  if (cards.length > 0) {
    return await createCards(filePath, sport, cards);
  }

  logger.warn("No cards found for the specified sport.");
  return null;
}
