import { downloadFile } from "../services/download-file";
import { getXlsxLink } from "../services/get-xlsx-link";
import processCards from "./process-cards";
import logger from "../shared/logger";
import { getSport } from "../utils/get-sport";
import type { CreateCardsResult } from "./create-cards";

export async function importCardsFromUrl(
  url: string
): Promise<CreateCardsResult | null> {
  logger.info(`Importing cards from URL: ${url}`);

  const sport = getSport(url);
  logger.info(`Detected sport: ${sport}`);

  const xlsxLink = await getXlsxLink(url);

  if (!xlsxLink) {
    logger.fatal("Could not find XLSX link in the provided URL");
    return null;
  }

  const filePath = await downloadFile(xlsxLink);
  const result = await processCards(filePath, sport);

  if (result) {
    logger.info(
      `Successfully imported ${result.cards.length} cards from URL (set ${result.setId})`
    );
  }

  return result;
}
