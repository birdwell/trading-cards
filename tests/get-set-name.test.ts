import { getSetName } from "../src/utils/get-set-name";

describe("getSetName", () => {
  it("should parse year range format with NBA", () => {
    const result = getSetName("2024-25-Panini-NBA-Hoops-Basketball-Checklist.xlsx");
    expect(result.year).toBe("2024-25");
    expect(result.name).toBe("Panini NBA Hoops");
  });

  it("should parse single year format with Football", () => {
    const result = getSetName("2024-Panini-Prizm-Football-Checklist.xlsx");
    expect(result.year).toBe("2024");
    expect(result.name).toBe("Panini Prizm");
  });

  it("should handle different brands", () => {
    const result = getSetName("2023-Topps-Chrome-Basketball-Checklist.xlsx");
    expect(result.year).toBe("2023");
    expect(result.name).toBe("Topps Chrome");
  });

  it("should handle year range with different brand", () => {
    const result = getSetName("2023-24-Upper-Deck-Series-1-Basketball-Checklist.xlsx");
    expect(result.year).toBe("2023-24");
    expect(result.name).toBe("Upper Deck Series 1");
  });

  it("should handle files without Checklist suffix", () => {
    const result = getSetName("2024-Panini-Donruss-Football.xlsx");
    expect(result.year).toBe("2024");
    expect(result.name).toBe("Panini Donruss");
  });

  it("should handle files with path", () => {
    const result = getSetName("./spreadsheet-downloads/2024-25-Panini-NBA-Hoops-Basketball-Checklist.xlsx");
    expect(result.year).toBe("2024-25");
    expect(result.name).toBe("Panini NBA Hoops");
  });

  it("should fallback gracefully for unexpected formats", () => {
    const result = getSetName("random-file-name.xlsx");
    expect(result.year).toBe(new Date().getFullYear().toString());
    expect(result.name).toBe("random file name");
  });
});
