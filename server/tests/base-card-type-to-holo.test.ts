import {
  baseCardTypeToHolo,
  findMissingHoloCards,
} from "../utils/base-card-type-to-holo";

describe("baseCardTypeToHolo", () => {
  test("maps Base to Holo", () => {
    expect(baseCardTypeToHolo("Base")).toBe("Holo");
    expect(baseCardTypeToHolo("base")).toBe("Holo");
  });

  test("maps Base variants to Holo variants", () => {
    expect(baseCardTypeToHolo("Base - Rated Rookies")).toBe(
      "Holo - Rated Rookies"
    );
    expect(baseCardTypeToHolo("Base - Rated Rookies Signatures")).toBe(
      "Holo - Rated Rookies Signatures"
    );
  });

  test("maps base-set rookies to Holo rookies", () => {
    expect(baseCardTypeToHolo("Rated Rookie")).toBe("Holo - Rated Rookie");
    expect(baseCardTypeToHolo("Rated Rookies")).toBe("Holo - Rated Rookies");
    expect(baseCardTypeToHolo("Rookie")).toBe("Holo - Rookie");
    expect(baseCardTypeToHolo("Base Rated Rookies")).toBe(
      "Holo - Rated Rookies"
    );
  });

  test("returns null for non-base types", () => {
    expect(baseCardTypeToHolo("Holo")).toBeNull();
    expect(baseCardTypeToHolo("Holo - Rated Rookie")).toBeNull();
    expect(baseCardTypeToHolo("Insert")).toBeNull();
    expect(baseCardTypeToHolo("")).toBeNull();
  });

  test("leaves existing parallels and rookie inserts alone", () => {
    expect(baseCardTypeToHolo("Base Red")).toBeNull();
    expect(baseCardTypeToHolo("Base Holo")).toBeNull();
    expect(baseCardTypeToHolo("Base Rated Rookies Gold")).toBeNull();
    expect(baseCardTypeToHolo("Rated Rookies Autographs")).toBeNull();
    expect(baseCardTypeToHolo("The Rookies")).toBeNull();
  });
});

describe("findMissingHoloCards", () => {
  const card = (cardNumber: number, playerName: string, cardType: string) => ({
    cardNumber,
    playerName,
    cardType,
  });

  test("creates one holo per base-set card", () => {
    expect(
      findMissingHoloCards([
        card(81, "Dak Prescott", "Base"),
        card(230, "Donovan Ezeiruaku", "Rated Rookie"),
        card(5, "Emmitt Smith", "Downtown"),
      ])
    ).toEqual([
      card(81, "Dak Prescott", "Holo"),
      card(230, "Donovan Ezeiruaku", "Holo - Rated Rookie"),
    ]);
  });

  test("skips holos that already exist", () => {
    expect(
      findMissingHoloCards([
        card(81, "Dak Prescott", "Base"),
        card(81, "Dak Prescott", "Holo"),
        card(24, "CeeDee Lamb", "Base"),
      ])
    ).toEqual([card(24, "CeeDee Lamb", "Holo")]);
  });

  test("does not double-create when a base card appears twice", () => {
    expect(
      findMissingHoloCards([
        card(81, "Dak Prescott", "Base"),
        card(81, "Dak Prescott", "Base"),
      ])
    ).toEqual([card(81, "Dak Prescott", "Holo")]);
  });
});
