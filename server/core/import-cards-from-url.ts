import { downloadFile } from "../services/download-file";
import {
  getChecklistSource,
  saveInlineChecklist,
} from "../services/get-checklist-source";
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
  const checklist = await getChecklistSource(url);

  if (!checklist) {
    logger.fatal(
      "Could not find an XLSX link or inline checklist in the provided URL"
    );
    return;
  }

  yield { type: "progress", stage: "downloading" };

  let filePath: string;
  let checklistData: string;

  switch (checklist.kind) {
    case "xlsx": {
      filePath = await downloadFile(checklist.url);
      yield { type: "progress", stage: "checking_existing" };
      const existing = await findExistingSetByFilePath(filePath);
      if (existing) {
        yield toImportCompleteEvent(existing);
        return;
      }

      yield { type: "progress", stage: "parsing" };
      checklistData = await readSpreadsheetAsCsv(filePath);
      break;
    }
    case "inline": {
      filePath = await saveInlineChecklist(
        checklist.text,
        checklist.sourceFileName
      );
      yield { type: "progress", stage: "checking_existing" };
      const existing = await findExistingSetByFilePath(filePath);
      if (existing) {
        yield toImportCompleteEvent(existing);
        return;
      }

      yield { type: "progress", stage: "parsing" };
      checklistData = checklist.text;
      break;
    }
    default: {
      const _exhaustive: never = checklist;
      return _exhaustive;
    }
  }

  yield { type: "progress", stage: "extracting" };
  const cards = await extractCardsWithLlm(checklistData, sport);

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
