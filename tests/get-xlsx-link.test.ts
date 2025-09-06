import { chromium } from "playwright";
import { getXlsxLink } from "../src/services/get-xlsx-link";

describe("getXlsxLink", () => {
  it("should return the xlsx link if found", async () => {
    const mockPage = {
      goto: jest.fn(),
      locator: jest.fn().mockReturnThis(),
      getAttribute: jest
        .fn()
        .mockResolvedValue("https://example.com/file.xlsx"),
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };
    const launchSpy = jest
      .spyOn(chromium, "launch")
      .mockResolvedValue(mockBrowser as any);

    const link = await getXlsxLink("https://example.com");
    expect(link).toBe("https://example.com/file.xlsx");

    launchSpy.mockRestore();
  });

  it("should return null if no xlsx link is found", async () => {
    const mockPage = {
      goto: jest.fn(),
      locator: jest.fn().mockReturnThis(),
      getAttribute: jest.fn().mockResolvedValue(null),
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };
    const launchSpy = jest
      .spyOn(chromium, "launch")
      .mockResolvedValue(mockBrowser as any);

    const link = await getXlsxLink("https://example.com");
    expect(link).toBeNull();

    launchSpy.mockRestore();
  });
});
