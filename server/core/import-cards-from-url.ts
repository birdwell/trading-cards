import { downloadFile } from "../services/download-file";
import { getXlsxLink } from "../services/get-xlsx-link";
import {
  extractCardsWithLlm,
  readSpreadsheetAsCsv,
} from "./process-cards";
import {
  createCards,
  findExistingSetByFilePath,
} from "./create-cards";
import logger from "../shared/logger";
import { getSport } from "../utils/get-sport";
import {
  ImportEvent,
  toImportCompleteEvent,
} from "./import-events";

export async function* importCardsFromUrl(
  url: string
): AsyncGenerator<ImportEvent> {
  logger.info(`Importing cards from URL: ${url}`);

  const sport = getSport(url);
  logger.info(`Detected sport: ${sport}`);

  yield { type: "progress", stage: "finding_checklist" };
  const xlsxLink = await getXlsxLink(url);

  if (!xlsxLink) {
    logger.fatal("Could not find XLSX link in the provided URL");
    return;
  }

  yield { type: "progress", stage: "downloading" };
  const filePath = await downloadFile(xlsxLink);

  yield { type: "progress", stage: "checking_existing" };
  const existing = await findExistingSetByFilePath(filePath);
  if (existing) {
    yield toImportCompleteEvent(existing);
    return;
  }

  yield { type: "progress", stage: "parsing" };
  const csvData = await readSpreadsheetAsCsv(filePath);

  yield { type: "progress", stage: "extracting" };
  const cards = await extractCardsWithLlm(csvData, sport);

  if (cards.length === 0) {
    logger.warn("No cards found for the specified sport.");
    return;
  }

  yield { type: "progress", stage: "saving" };
  const result = await createCards(filePath, sport, cards);

  logger.info(
    `Successfully imported ${result.cards.length} cards from URL (set ${result.setId})`
  );

  yield toImportCompleteEvent(result);
}
