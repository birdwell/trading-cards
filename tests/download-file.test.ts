import axios from "axios";
import * as fs from "fs";
import { PassThrough } from "stream";
import { downloadFile } from "../src/services/download-file";

jest.mock("axios");
jest.mock("fs");

describe("downloadFile", () => {
  it("should download a file", async () => {
    // Mock fs methods
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);

    const mockWriteStream = new PassThrough();
    (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);

    const mockAxiosResponse = {
      data: new PassThrough(),
    };
    (axios as unknown as jest.Mock).mockResolvedValue(mockAxiosResponse);

    // Start the download
    const downloadPromise = downloadFile("https://example.com/file.xlsx");

    // Simulate the stream finishing
    setTimeout(() => {
      mockWriteStream.emit("finish");
    }, 10);

    // Wait for the download to complete
    const result = await downloadPromise;

    expect(fs.createWriteStream).toHaveBeenCalledWith(
      "spreadsheet-downloads/file.xlsx"
    );
    expect(result).toBe("spreadsheet-downloads/file.xlsx");
  });
});
