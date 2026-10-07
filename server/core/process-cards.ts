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
  checklistData: string,
  sport: Sport
): Promise<CardsFromLLM[]> {
  const team =
    sport == Sport.Basketball ? "Oklahoma City Thunder" : "Dallas Cowboys";

  const systemPrompt = `
    You are an expert at parsing sports card checklists.
    From the following data, extract the cards that are for the "${team}".

    The data may be either:
    1. Spreadsheet/CSV rows with columns such as card type, card number, player name, and team, or
    2. Inline web checklist text with lines like "27 Dak Prescott" under section headings (Base, Rookies, Rated Rookies, etc.), often without a team column.

    Rules:
    - If a team column/value is present, only include rows for "${team}".
    - If team is absent, include only players you know were on "${team}" (or that franchise) for the set's era.
    - Prefer base-set style entries over parallel-only duplicate lines when both appear.
    - For each card, provide cardNumber (integer), playerName (string), and cardType (string such as "Base", "Rookie", or "Rated Rookie").
    - Infer cardType from nearby section headings when not in a column.
    - Skip non-card lines (parallels lists, pack odds, prose).
    Output a JSON array of objects with keys: cardNumber, playerName, cardType.
  `;

  const { object: cards } = await generateObject({
    model: createGeminiModel(),
    system: systemPrompt,
    prompt: checklistData,
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
