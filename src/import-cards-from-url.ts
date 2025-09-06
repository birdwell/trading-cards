import { downloadFile } from "./download-file";
import { getXlsxLink } from "./get-xlsx-link";
import processCards from "./process-cards";
import logger from "./logger";
import { getSport } from "./get-sport";

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
