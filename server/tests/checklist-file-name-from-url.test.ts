import {
  checklistFileNameFromUrl,
  hasInlineCardLines,
} from "../utils/checklist-file-name-from-url";

describe("checklistFileNameFromUrl", () => {
  it("builds a checklist filename from a Beckett football slug", () => {
    expect(
      checklistFileNameFromUrl(
        "https://www.beckett.com/news/2019-donruss-optic-football-cards/"
      )
    ).toBe("2019-Donruss-Optic-Football-Checklist.txt");
  });

  it("builds a checklist filename from a basketball slug", () => {
    expect(
      checklistFileNameFromUrl(
        "https://www.beckett.com/news/2018-19-donruss-optic-basketball-cards/"
      )
    ).toBe("2018-19-Donruss-Optic-Basketball-Checklist.txt");
  });
});

describe("hasInlineCardLines", () => {
  it("detects numbered card lines", () => {
    const text = Array.from(
      { length: 12 },
      (_, i) => `${i + 1} Player Name`
    ).join("\n");
    expect(hasInlineCardLines(text)).toBe(true);
  });

  it("rejects pages without enough card lines", () => {
    expect(hasInlineCardLines("Hello world\nNo cards here")).toBe(false);
  });

  it("does not treat year headings as card lines", () => {
    const text = Array.from(
      { length: 12 },
      (_, i) => `201${i} Donruss Optic Football overview`
    ).join("\n");
    expect(hasInlineCardLines(text)).toBe(false);
  });
});
