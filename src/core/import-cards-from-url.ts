import { downloadFile } from "../services/download-file";
import { getXlsxLink } from "../services/get-xlsx-link";
import processCards from "./process-cards";
import logger from "../shared/logger";
import { getSport } from "../utils/get-sport";

export async function importCardsFromUrl(url: string) {
  logger.info(`Importing cards from URL: ${url}`);

  // Automatically determine sport from URL
  const sport = getSport(url);
  logger.info(`Detected sport: ${sport}`);

  const xlsxLink = await getXlsxLink(url);

  if (xlsxLink) {
    const filePath = await downloadFile(xlsxLink);
    const cards = await processCards(filePath, sport);

    logger.info(`Successfully imported ${cards.length} cards from URL`);

    return cards;
  } else {
    logger.fatal("Could not find XLSX link in the provided URL");

    return [];
  }
}
