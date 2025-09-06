import { tradingCards, TradingCardService } from "../src/db/service";
import { db, sets, cards } from "../src/db/index";
import { CreateSetData, CreateCardData } from "../src/db/types";
import { eq, inArray, like } from "drizzle-orm";

describe("TradingCardService Integration Tests", () => {
  let testSetId: number;
  let testCardIds: number[] = [];

  // Test data
  const testSet: CreateSetData = {
    name: "Test Basketball Set 2024",
    year: "2024",
    sourceFile: "test-basketball-2024.xlsx",
    sport: "Basketball",
  };

  const testCards: CreateCardData[] = [
    {
      cardNumber: 1,
      playerName: "LeBron James",
      cardType: "Base",
      setId: 0, // Will be updated after set creation
    },
    {
      cardNumber: 2,
      playerName: "Stephen Curry",
      cardType: "Base",
      setId: 0,
    },
    {
      cardNumber: 3,
      playerName: "Chet Holmgren",
      cardType: "Rookie",
      setId: 0,
    },
    {
      cardNumber: 4,
      playerName: "Shai Gilgeous-Alexander",
      cardType: "Insert",
      setId: 0,
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

      // Delete test set
      if (testSetId) {
        await db.delete(sets).where(eq(sets.id, testSetId));
        testSetId = 0;
      }

      // Also cleanup any sets with test source file pattern
      await db.delete(sets).where(like(sets.sourceFile, "test-%"));
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

  describe("Set Operations", () => {
    test("should create a new set", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      expect(createdSet).toBeDefined();
      expect(createdSet.id).toBeGreaterThan(0);
      expect(createdSet.name).toBe(testSet.name);
      expect(createdSet.year).toBe(testSet.year);
      expect(createdSet.sourceFile).toBe(testSet.sourceFile);
      expect(createdSet.sport).toBe(testSet.sport);
    });

    test("should find set by source file", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      const foundSet = await tradingCards.sets.findBySourceFile(
        testSet.sourceFile
      );

      expect(foundSet).toBeDefined();
      expect(foundSet!.id).toBe(createdSet.id);
      expect(foundSet!.name).toBe(testSet.name);
    });

    test("should find set by ID", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      const foundSet = await tradingCards.sets.findById(createdSet.id);

      expect(foundSet).toBeDefined();
      expect(foundSet!.id).toBe(createdSet.id);
      expect(foundSet!.name).toBe(testSet.name);
    });

    test("should find sets by name (partial match)", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      const foundSets = await tradingCards.sets.findByName("Basketball");

      expect(foundSets).toBeDefined();
      expect(foundSets.length).toBeGreaterThan(0);
      expect(foundSets.some((set) => set.id === createdSet.id)).toBe(true);
    });

    test("should find sets by year", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      const foundSets = await tradingCards.sets.findByYear("2024");

      expect(foundSets).toBeDefined();
      expect(foundSets.length).toBeGreaterThan(0);
      expect(foundSets.some((set) => set.id === createdSet.id)).toBe(true);
    });

    test("should return all sets", async () => {
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      const allSets = await tradingCards.sets.findAll();

      expect(allSets).toBeDefined();
      expect(Array.isArray(allSets)).toBe(true);
      expect(allSets.some((set) => set.id === createdSet.id)).toBe(true);
    });
  });

  describe("Card Operations", () => {
    beforeEach(async () => {
      // Create test set for card operations
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      // Update test cards with the created set ID
      testCards.forEach((card) => {
        card.setId = testSetId;
      });
    });

    test("should create multiple cards", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      expect(createdCards).toBeDefined();
      expect(createdCards.length).toBe(testCards.length);
      expect(createdCards.every((card) => card.id > 0)).toBe(true);
      expect(createdCards.every((card) => card.setId === testSetId)).toBe(true);
    });

    test("should create a single card", async () => {
      const createdCard = await tradingCards.cards.createSingle(testCards[0]);
      testCardIds.push(createdCard.id);

      expect(createdCard).toBeDefined();
      expect(createdCard.id).toBeGreaterThan(0);
      expect(createdCard.playerName).toBe(testCards[0].playerName);
      expect(createdCard.cardType).toBe(testCards[0].cardType);
      expect(createdCard.setId).toBe(testSetId);
    });

    test("should find card by ID", async () => {
      const createdCard = await tradingCards.cards.createSingle(testCards[0]);
      testCardIds.push(createdCard.id);

      const foundCard = await tradingCards.cards.findById(createdCard.id);

      expect(foundCard).toBeDefined();
      expect(foundCard.id).toBe(createdCard.id);
      expect(foundCard.playerName).toBe(testCards[0].playerName);
    });

    test("should find cards by set ID", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findBySetId(testSetId);

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBe(testCards.length);
      expect(foundCards.every((card) => card.setId === testSetId)).toBe(true);
    });

    test("should find cards by set ID with set information", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findBySetIdWithSet(testSetId);

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBe(testCards.length);
      expect(foundCards.every((card) => card.set)).toBe(true);
      expect(foundCards.every((card) => card.set.id === testSetId)).toBe(true);
    });

    test("should find cards by player name (partial match)", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findByPlayer("LeBron");

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBe(1); // LeBron James has 1 card in test data
      expect(
        foundCards.every((card) => card.playerName.includes("LeBron"))
      ).toBe(true);
    });

    test("should find cards by exact player name", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findByPlayerExact(
        "LeBron James"
      );

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBe(1); // LeBron James has 1 card in test data
      expect(
        foundCards.every((card) => card.playerName === "LeBron James")
      ).toBe(true);
    });

    test("should find cards by card type", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findByCardType("Base");

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBeGreaterThanOrEqual(2); // At least 2 Base cards in test data
      expect(foundCards.every((card) => card.cardType === "Base")).toBe(true);
    });

    test("should find cards by card number", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const foundCards = await tradingCards.cards.findByCardNumber(1);

      expect(foundCards).toBeDefined();
      expect(foundCards.length).toBeGreaterThanOrEqual(1);
      expect(foundCards.every((card) => card.cardNumber === 1)).toBe(true);
    });

    test("should return all cards", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const allCards = await tradingCards.cards.findAll();

      expect(allCards).toBeDefined();
      expect(Array.isArray(allCards)).toBe(true);
      expect(allCards.length).toBeGreaterThanOrEqual(testCards.length);
    });

    test("should return all cards with set information", async () => {
      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);

      const allCards = await tradingCards.cards.findAllWithSets();

      expect(allCards).toBeDefined();
      expect(Array.isArray(allCards)).toBe(true);
      expect(allCards.length).toBeGreaterThanOrEqual(testCards.length);
      expect(allCards.every((card) => card.set)).toBe(true);
    });
  });

  describe("Combined Operations", () => {
    beforeEach(async () => {
      // Create test set and cards for combined operations
      const createdSet = await tradingCards.sets.create(testSet);
      testSetId = createdSet.id;

      testCards.forEach((card) => {
        card.setId = testSetId;
      });

      const createdCards = await tradingCards.cards.create(testCards);
      testCardIds = createdCards.map((card) => card.id);
    });

    test("should find cards in set", async () => {
      const cardsInSet = await tradingCards.findCardsInSet(testSetId);

      expect(cardsInSet).toBeDefined();
      expect(cardsInSet.length).toBe(testCards.length);
      expect(cardsInSet.every((card) => card.setId === testSetId)).toBe(true);
    });

    test("should find player cards in specific set", async () => {
      const playerCards = await tradingCards.findPlayerCardsInSet(
        "LeBron",
        testSetId
      );

      expect(playerCards).toBeDefined();
      expect(playerCards.length).toBe(1); // LeBron James has 1 card
      expect(
        playerCards.every((card) => card.playerName.includes("LeBron"))
      ).toBe(true);
      expect(playerCards.every((card) => card.setId === testSetId)).toBe(true);
    });

    test("should get comprehensive set statistics", async () => {
      const stats = await tradingCards.getSetStats(testSetId);

      expect(stats).toBeDefined();
      expect(stats!.set.id).toBe(testSetId);
      expect(stats!.totalCards).toBe(testCards.length);
      expect(stats!.uniqueCardTypes).toBe(3); // Base, Rookie, Insert
      expect(stats!.uniquePlayers).toBe(4); // LeBron, Curry, Chet, Shai
      expect(stats!.cardTypes).toContain("Base");
      expect(stats!.cardTypes).toContain("Rookie");
      expect(stats!.cardTypes).toContain("Insert");
      expect(stats!.players).toContain("LeBron James");
      expect(stats!.players).toContain("Stephen Curry");
      expect(stats!.players).toContain("Chet Holmgren");
      expect(stats!.players).toContain("Shai Gilgeous-Alexander");
    });

    test("should search cards by player name", async () => {
      const searchResults = await tradingCards.searchCards("Curry");

      expect(searchResults).toBeDefined();
      expect(searchResults.length).toBeGreaterThanOrEqual(1);
      expect(
        searchResults.some((card) => card.playerName.includes("Curry"))
      ).toBe(true);
    });

    test("should return null stats for non-existent set", async () => {
      const stats = await tradingCards.getSetStats(99999);

      expect(stats).toBeNull();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle finding non-existent set by ID", async () => {
      const foundSet = await tradingCards.sets.findById(99999);

      expect(foundSet).toBeUndefined();
    });

    test("should handle finding non-existent set by source file", async () => {
      const foundSet = await tradingCards.sets.findBySourceFile(
        "non-existent-file.xlsx"
      );

      expect(foundSet).toBeUndefined();
    });

    test("should handle finding non-existent card by ID", async () => {
      const foundCard = await tradingCards.cards.findById(99999);

      expect(foundCard).toBeUndefined();
    });

    test("should return empty array when searching for non-existent player", async () => {
      const foundCards = await tradingCards.cards.findByPlayer(
        "NonExistentPlayer"
      );

      expect(foundCards).toBeDefined();
      expect(Array.isArray(foundCards)).toBe(true);
      expect(foundCards.length).toBe(0);
    });

    test("should return empty array when finding cards in non-existent set", async () => {
      const cardsInSet = await tradingCards.findCardsInSet(99999);

      expect(cardsInSet).toBeDefined();
      expect(Array.isArray(cardsInSet)).toBe(true);
      expect(cardsInSet.length).toBe(0);
    });
  });
});
