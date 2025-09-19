
import { eq, inArray, like } from "drizzle-orm";
import { CardsFromLLM } from "../db/types";
import { cards, db, sets } from "../db";
import { createCards } from "../core/create-cards";
import { tradingCards } from "../db/service";
import { Sport } from "../shared/types";

// Mock only the logger to avoid console noise during tests
jest.mock("../shared/logger");

describe("createCards Integration Tests", () => {
  let testSetIds: number[] = [];
  let testCardIds: number[] = [];

  // Test data
  const testCardsFromLLM: CardsFromLLM[] = [
    {
      cardNumber: 1,
      playerName: "LeBron James",
      cardType: "Base",
    },
    {
      cardNumber: 2,
      playerName: "Stephen Curry",
      cardType: "Rookie",
    },
    {
      cardNumber: 3,
      playerName: "Giannis Antetokounmpo",
      cardType: "Insert",
    },
  ];

  // Cleanup function to remove test data
  const cleanupTestData = async () => {
    try {
      // Delete test cards
      if (testCardIds.length > 0) {
        await db.delete(cards).where(inArray(cards.id, testCardIds));
        testCardIds = [];
      }

      // Delete test sets
      if (testSetIds.length > 0) {
        await db.delete(sets).where(inArray(sets.id, testSetIds));
        testSetIds = [];
      }

      // Also cleanup any sets with test source file pattern
      await db.delete(sets).where(like(sets.sourceFile, "test-create-cards-%"));
    } catch (error) {
      console.warn("Cleanup warning:", error);
    }
  };

  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("when set does not exist", () => {
    it("should create new set and cards", async () => {
      const filePath = "/path/to/test-create-cards-2024-Panini-Prizm-Basketball-Checklist.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, testCardsFromLLM);

      // Track created data for cleanup
      if (result.length > 0) {
        testSetIds.push(result[0].setId);
        testCardIds = result.map(card => card.id);
      }

      expect(result).toBeDefined();
      expect(result.length).toBe(testCardsFromLLM.length);
      
      // Verify all cards have the same setId
      const setId = result[0].setId;
      expect(result.every(card => card.setId === setId)).toBe(true);
      
      // Verify card data
      expect(result[0].playerName).toBe("LeBron James");
      expect(result[0].cardType).toBe("Base");
      expect(result[0].cardNumber).toBe(1);
      
      expect(result[1].playerName).toBe("Stephen Curry");
      expect(result[1].cardType).toBe("Rookie");
      expect(result[1].cardNumber).toBe(2);
      
      expect(result[2].playerName).toBe("Giannis Antetokounmpo");
      expect(result[2].cardType).toBe("Insert");
      expect(result[2].cardNumber).toBe(3);

      // Verify set was created in database
      const createdSet = await tradingCards.sets.findById(setId);
      expect(createdSet).toBeDefined();
      expect(createdSet!.name).toBe("test create cards 2024 Panini Prizm Basketball Checklist");
      expect(createdSet!.year).toBe(new Date().getFullYear().toString());
      expect(createdSet!.sport).toBe(sport);
      expect(createdSet!.sourceFile).toBe("test-create-cards-2024-Panini-Prizm-Basketball-Checklist.xlsx");
    });

    it("should handle file path extraction correctly", async () => {
      const fullPath = "/Users/test/downloads/test-create-cards-2024-Topps-Chrome-Football-Checklist.xlsx";
      const sport = Sport.Football;

      const result = await createCards(fullPath, sport, testCardsFromLLM);

      // Track created data for cleanup
      if (result.length > 0) {
        testSetIds.push(result[0].setId);
        testCardIds = result.map(card => card.id);
      }

      expect(result).toBeDefined();
      expect(result.length).toBe(testCardsFromLLM.length);

      // Verify set was created with correct filename
      const setId = result[0].setId;
      const createdSet = await tradingCards.sets.findById(setId);
      expect(createdSet!.sourceFile).toBe("test-create-cards-2024-Topps-Chrome-Football-Checklist.xlsx");
      expect(createdSet!.sport).toBe("Football");
    });

    it("should handle empty cards array", async () => {
      const filePath = "/path/to/test-create-cards-empty-set.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, []);

      expect(result).toBeDefined();
      expect(result.length).toBe(0);

      // Verify set was still created
      const createdSet = await tradingCards.sets.findBySourceFile("test-create-cards-empty-set.xlsx");
      expect(createdSet).toBeDefined();
      testSetIds.push(createdSet!.id);
    });

    it("should handle single card", async () => {
      const filePath = "/path/to/test-create-cards-single-card.xlsx";
      const sport = Sport.Basketball;
      const singleCard: CardsFromLLM[] = [
        {
          cardNumber: 23,
          playerName: "Michael Jordan",
          cardType: "Legend",
        },
      ];

      const result = await createCards(filePath, sport, singleCard);

      // Track created data for cleanup
      if (result.length > 0) {
        testSetIds.push(result[0].setId);
        testCardIds = result.map(card => card.id);
      }

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].playerName).toBe("Michael Jordan");
      expect(result[0].cardType).toBe("Legend");
      expect(result[0].cardNumber).toBe(23);
    });
  });

  describe("when set already exists", () => {
    it("should return empty array and not create duplicate cards", async () => {
      const filePath = "/path/to/test-create-cards-existing-set.xlsx";
      const sport = Sport.Basketball;

      // First call - should create set and cards
      const firstResult = await createCards(filePath, sport, testCardsFromLLM);
      
      // Track created data for cleanup
      if (firstResult.length > 0) {
        testSetIds.push(firstResult[0].setId);
        testCardIds = firstResult.map(card => card.id);
      }

      expect(firstResult.length).toBe(testCardsFromLLM.length);

      // Second call with same file - should return empty array
      const secondResult = await createCards(filePath, sport, testCardsFromLLM);
      
      expect(secondResult).toBeDefined();
      expect(secondResult.length).toBe(0);

      // Verify only one set exists with this source file
      const existingSet = await tradingCards.sets.findBySourceFile("test-create-cards-existing-set.xlsx");
      expect(existingSet).toBeDefined();

      // Verify card count hasn't changed
      const cardsInSet = await tradingCards.cards.findBySetId(firstResult[0].setId);
      expect(cardsInSet.length).toBe(testCardsFromLLM.length);
    });
  });

  describe("different sports handling", () => {
    it("should create sets for different sports", async () => {
      const basketballFile = "/path/to/test-create-cards-basketball.xlsx";
      const footballFile = "/path/to/test-create-cards-football.xlsx";

      const basketballResult = await createCards(basketballFile, Sport.Basketball, testCardsFromLLM);
      const footballResult = await createCards(footballFile, Sport.Football, testCardsFromLLM);

      // Track created data for cleanup
      if (basketballResult.length > 0) {
        testSetIds.push(basketballResult[0].setId);
        testCardIds.push(...basketballResult.map(card => card.id));
      }
      if (footballResult.length > 0) {
        testSetIds.push(footballResult[0].setId);
        testCardIds.push(...footballResult.map(card => card.id));
      }

      expect(basketballResult.length).toBe(testCardsFromLLM.length);
      expect(footballResult.length).toBe(testCardsFromLLM.length);

      // Verify different set IDs
      expect(basketballResult[0].setId).not.toBe(footballResult[0].setId);

      // Verify sports are set correctly
      const basketballSet = await tradingCards.sets.findById(basketballResult[0].setId);
      const footballSet = await tradingCards.sets.findById(footballResult[0].setId);
      
      expect(basketballSet!.sport).toBe("Basketball");
      expect(footballSet!.sport).toBe("Football");
    });
  });

  describe("database integration", () => {
    it("should persist data correctly in database", async () => {
      const filePath = "/path/to/test-create-cards-persistence.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, testCardsFromLLM);

      // Track created data for cleanup
      if (result.length > 0) {
        testSetIds.push(result[0].setId);
        testCardIds = result.map(card => card.id);
      }

      const setId = result[0].setId;

      // Verify data can be retrieved independently
      const retrievedSet = await tradingCards.sets.findById(setId);
      const retrievedCards = await tradingCards.cards.findBySetId(setId);

      expect(retrievedSet).toBeDefined();
      expect(retrievedCards.length).toBe(testCardsFromLLM.length);

      // Verify card-set relationships
      expect(retrievedCards.every(card => card.setId === setId)).toBe(true);
    });
  });
});