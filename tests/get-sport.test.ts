import { getSport } from "../src/utils/get-sport";
import { Sport } from "../src/shared/types";

describe("getSport", () => {
  test("should detect football from Beckett football URLs", () => {
    const url =
      "https://www.beckett.com/news/2024-panini-prizm-football-cards/";
    expect(getSport(url)).toBe(Sport.Football);
  });

  test("should detect basketball from Beckett basketball URLs", () => {
    const url =
      "https://www.beckett.com/news/2024-25-panini-nba-hoops-basketball-cards/";
    expect(getSport(url)).toBe(Sport.Basketball);
  });

  test("should handle case insensitive matching", () => {
    expect(getSport("https://beckett.com/FOOTBALL-cards")).toBe(Sport.Football);
    expect(getSport("https://beckett.com/BASKETBALL-cards")).toBe(
      Sport.Basketball
    );
  });

  test("should prioritize basketball when both keywords present", () => {
    const url = "https://beckett.com/basketball-vs-football-comparison";
    expect(getSport(url)).toBe(Sport.Basketball);
  });

  test("should default to football for URLs without keywords", () => {
    const url = "https://www.beckett.com/news/2024-panini-cards/";
    expect(getSport(url)).toBe(Sport.Football);
  });
});
