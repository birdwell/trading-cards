import { downloadFile } from "./download-file";
import { getXlsxLink } from "./get-xlsx-link";
import processCards from "./process-cards";
import logger from "./logger";
import { Sport } from "./types";

export async function importCardsFromUrl(
  url: string,
  sport: Sport = Sport.Football
) {
  logger.info(`Importing cards from URL: ${url}`);

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
