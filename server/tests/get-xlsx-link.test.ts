import { chromium } from "playwright";
import { getChecklistSource, getXlsxLink } from "../services/get-xlsx-link";

function mockBrowser(page: Record<string, unknown>) {
  return {
    newPage: jest.fn().mockResolvedValue(page),
    close: jest.fn(),
  };
}

describe("getChecklistSource", () => {
  it("should return an xlsx source when a spreadsheet link exists", async () => {
    const xlsxLocator = {
      count: jest.fn().mockResolvedValue(1),
      first: jest.fn().mockReturnValue({
        getAttribute: jest
          .fn()
          .mockResolvedValue("https://example.com/file.xlsx"),
      }),
    };

    const page = {
      goto: jest.fn(),
      locator: jest.fn((selector: string) => {
        if (selector === 'a[href$=".xlsx"]') {
          return xlsxLocator;
        }
        return {
          first: jest.fn().mockReturnValue({
            count: jest.fn().mockResolvedValue(0),
            innerText: jest.fn(),
          }),
        };
      }),
    };

    const launchSpy = jest
      .spyOn(chromium, "launch")
      .mockResolvedValue(mockBrowser(page) as never);

    const source = await getChecklistSource("https://example.com");
    expect(source).toEqual({
      kind: "xlsx",
      url: "https://example.com/file.xlsx",
    });

    launchSpy.mockRestore();
  });

  it("should fall back to inline checklist text when no xlsx link exists", async () => {
    const cardLines = Array.from(
      { length: 12 },
      (_, i) => `${i + 1} Player ${i + 1}`
    ).join("\n");

    const xlsxLocator = {
      count: jest.fn().mockResolvedValue(0),
      first: jest.fn(),
    };

    const articleLocator = {
      count: jest.fn().mockResolvedValue(1),
      innerText: jest.fn().mockResolvedValue(`Base Set Checklist\n${cardLines}`),
    };

    const page = {
      goto: jest.fn(),
      locator: jest.fn((selector: string) => {
        if (selector === 'a[href$=".xlsx"]') {
          return xlsxLocator;
        }
        if (selector === ".article-content") {
          return {
            first: jest.fn().mockReturnValue(articleLocator),
          };
        }
        return {
          first: jest.fn().mockReturnValue({
            count: jest.fn().mockResolvedValue(0),
            innerText: jest.fn(),
          }),
        };
      }),
    };

    const launchSpy = jest
      .spyOn(chromium, "launch")
      .mockResolvedValue(mockBrowser(page) as never);

    const source = await getChecklistSource(
      "https://www.beckett.com/news/2019-donruss-optic-football-cards/"
    );

    expect(source?.kind).toBe("inline");
    if (source?.kind === "inline") {
      expect(source.sourceFileName).toBe(
        "2019-Donruss-Optic-Football-Checklist.txt"
      );
      expect(source.text).toContain("1 Player 1");
    }

    launchSpy.mockRestore();
  });

  it("should return null when neither xlsx nor inline checklist is found", async () => {
    const xlsxLocator = {
      count: jest.fn().mockResolvedValue(0),
      first: jest.fn(),
    };

    const page = {
      goto: jest.fn(),
      locator: jest.fn((selector: string) => {
        if (selector === 'a[href$=".xlsx"]') {
          return xlsxLocator;
        }
        if (selector === "body") {
          return {
            innerText: jest.fn().mockResolvedValue("No checklist here"),
          };
        }
        return {
          first: jest.fn().mockReturnValue({
            count: jest.fn().mockResolvedValue(0),
            innerText: jest.fn().mockResolvedValue(""),
          }),
        };
      }),
    };

    const launchSpy = jest
      .spyOn(chromium, "launch")
      .mockResolvedValue(mockBrowser(page) as never);

    await expect(getXlsxLink("https://example.com")).resolves.toBeNull();
    await expect(getChecklistSource("https://example.com")).resolves.toBeNull();

    launchSpy.mockRestore();
  });
});
