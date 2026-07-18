import { baseCardTypeToHolo } from "../utils/base-card-type-to-holo";

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

  test("returns null for non-base types", () => {
    expect(baseCardTypeToHolo("Holo")).toBeNull();
    expect(baseCardTypeToHolo("Insert")).toBeNull();
    expect(baseCardTypeToHolo("")).toBeNull();
  });
});
