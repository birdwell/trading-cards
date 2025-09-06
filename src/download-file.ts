import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import logger from "./logger";

export async function downloadFile(fileUrl: string): Promise<string> {
  const folder = "./spreadsheet-downloads";

  // Ensure the folder exists
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Extract filename from URL
  const fileName = path.basename(fileUrl);
  const outputLocationPath = path.join(folder, fileName);

  // Check if file already exists locally
  if (fs.existsSync(outputLocationPath)) {
    logger.info(`File already exists locally: ${outputLocationPath}`);
    return outputLocationPath;
  }

  logger.info(`Downloading file from: ${fileUrl}`);
  const writer = fs.createWriteStream(outputLocationPath);
  const response = await axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  });

  (response.data as NodeJS.ReadableStream).pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      logger.info(`File downloaded to: ${outputLocationPath}`);
      resolve(outputLocationPath);
    });
    writer.on("error", (error) => {
      logger.fatal(`Error downloading file: ${error.message}`);
      reject(error);
    });
  });
}
