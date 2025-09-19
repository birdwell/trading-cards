import { getBrand, normalizeBrand } from "../utils/get-brand";

describe("getBrand", () => {
  test("should extract Panini brands correctly", () => {
    expect(getBrand("Panini NBA Hoops")).toBe("Panini NBA Hoops");
    expect(getBrand("Panini Prizm")).toBe("Panini Prizm");
    expect(getBrand("Panini Select")).toBe("Panini Select");
    expect(getBrand("Panini Mosaic")).toBe("Panini Mosaic");
  });

  test("should extract Donruss brands correctly", () => {
    expect(getBrand("Donruss Optic")).toBe("Donruss Optic");
    expect(getBrand("Donruss Elite")).toBe("Donruss Elite");
    expect(getBrand("Donruss")).toBe("Donruss");
  });

  test("should extract Topps brands correctly", () => {
    expect(getBrand("Topps Chrome")).toBe("Topps Chrome");
    expect(getBrand("Topps Stadium Club")).toBe("Topps Stadium Club");
    expect(getBrand("Topps")).toBe("Topps");
  });

  test("should handle case insensitive matching", () => {
    expect(getBrand("PANINI PRIZM")).toBe("PANINI PRIZM");
    expect(getBrand("donruss optic")).toBe("donruss optic");
  });

  test("should handle sets with years in the name", () => {
    expect(getBrand("2024-25 Panini Prizm Basketball")).toBe("Panini Prizm");
    expect(getBrand("2024 Topps Chrome Football")).toBe("Topps Chrome");
  });

  test("should fallback to first word for unknown brands", () => {
    expect(getBrand("Fleer Ultra")).toBe("Fleer Ultra");
    expect(getBrand("Unknown Brand Name")).toBe("Unknown Brand");
  });
});

describe("normalizeBrand", () => {
  test("should normalize brand names consistently", () => {
    expect(normalizeBrand("panini prizm")).toBe("Panini Prizm");
    expect(normalizeBrand("DONRUSS OPTIC")).toBe("Donruss Optic");
    expect(normalizeBrand("  Topps   Chrome  ")).toBe("Topps Chrome");
  });

  test("should handle single word brands", () => {
    expect(normalizeBrand("topps")).toBe("Topps");
    expect(normalizeBrand("DONRUSS")).toBe("Donruss");
  });
});
