import "dotenv/config";
import ExcelJS from "exceljs";
import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import logger from "../shared/logger";
import { Sport } from "../shared/types";
import { Card } from "../db/types";
import { createCards } from "./create-cards";

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

  const { object: cards } = await generateObject({
    model: googleApiModel,
    system: systemPrompt,
    prompt: csvData,
    schema: cardsSchema,
  });

  if (cards.length > 0) {
    return await createCards(filePath, sport, cards);
  } else {
    logger.warn("No cards found for the specified sport.");
    return [];
  }
}
