import { inArray, like } from "drizzle-orm";
import { CardsFromLLM } from "../db/types";
import { cards, db, sets } from "../db";
import { createCards } from "../core/create-cards";
import { tradingCards } from "../db/service";
import { Sport } from "../shared/types";

jest.mock("../shared/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
  },
}));

describe("createCards Integration Tests", () => {
  let testSetIds: number[] = [];
  let testCardIds: number[] = [];

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

  const cleanupTestData = async () => {
    try {
      if (testCardIds.length > 0) {
        await db.delete(cards).where(inArray(cards.id, testCardIds));
        testCardIds = [];
      }

      if (testSetIds.length > 0) {
        await db.delete(sets).where(inArray(sets.id, testSetIds));
        testSetIds = [];
      }

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
      const filePath =
        "/path/to/test-create-cards-2024-Panini-Prizm-Basketball-Checklist.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, testCardsFromLLM);

      testSetIds.push(result.setId);
      testCardIds = result.cards.map((card) => card.id);

      expect(result.alreadyExisted).toBe(false);
      expect(result.cards.length).toBe(testCardsFromLLM.length);
      expect(result.cards.every((card) => card.setId === result.setId)).toBe(
        true
      );

      expect(result.cards[0].playerName).toBe("LeBron James");
      expect(result.cards[0].cardType).toBe("Base");
      expect(result.cards[0].cardNumber).toBe(1);

      expect(result.cards[1].playerName).toBe("Stephen Curry");
      expect(result.cards[1].cardType).toBe("Rookie");
      expect(result.cards[1].cardNumber).toBe(2);

      expect(result.cards[2].playerName).toBe("Giannis Antetokounmpo");
      expect(result.cards[2].cardType).toBe("Insert");
      expect(result.cards[2].cardNumber).toBe(3);

      const createdSet = await tradingCards.sets.findById(result.setId);
      expect(createdSet).toBeDefined();
      expect(createdSet!.name).toBe(
        "test create cards 2024 Panini Prizm Basketball Checklist"
      );
      expect(createdSet!.year).toBe(new Date().getFullYear().toString());
      expect(createdSet!.sport).toBe(sport);
      expect(createdSet!.sourceFile).toBe(
        "test-create-cards-2024-Panini-Prizm-Basketball-Checklist.xlsx"
      );
    });

    it("should handle file path extraction correctly", async () => {
      const fullPath =
        "/Users/test/downloads/test-create-cards-2024-Topps-Chrome-Football-Checklist.xlsx";
      const sport = Sport.Football;

      const result = await createCards(fullPath, sport, testCardsFromLLM);

      testSetIds.push(result.setId);
      testCardIds = result.cards.map((card) => card.id);

      expect(result.cards.length).toBe(testCardsFromLLM.length);

      const createdSet = await tradingCards.sets.findById(result.setId);
      expect(createdSet!.sourceFile).toBe(
        "test-create-cards-2024-Topps-Chrome-Football-Checklist.xlsx"
      );
      expect(createdSet!.sport).toBe("Football");
    });

    it("should handle empty cards array", async () => {
      const filePath = "/path/to/test-create-cards-empty-set.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, []);

      testSetIds.push(result.setId);
      expect(result.alreadyExisted).toBe(false);
      expect(result.cards.length).toBe(0);

      const createdSet = await tradingCards.sets.findBySourceFile(
        "test-create-cards-empty-set.xlsx"
      );
      expect(createdSet).toBeDefined();
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

      testSetIds.push(result.setId);
      testCardIds = result.cards.map((card) => card.id);

      expect(result.cards.length).toBe(1);
      expect(result.cards[0].playerName).toBe("Michael Jordan");
      expect(result.cards[0].cardType).toBe("Legend");
      expect(result.cards[0].cardNumber).toBe(23);
    });
  });

  describe("when set already exists", () => {
    it("should return existing set without creating duplicates", async () => {
      const filePath = "/path/to/test-create-cards-existing-set.xlsx";
      const sport = Sport.Basketball;

      const firstResult = await createCards(filePath, sport, testCardsFromLLM);

      testSetIds.push(firstResult.setId);
      testCardIds = firstResult.cards.map((card) => card.id);

      expect(firstResult.alreadyExisted).toBe(false);
      expect(firstResult.cards.length).toBe(testCardsFromLLM.length);

      const secondResult = await createCards(filePath, sport, testCardsFromLLM);

      expect(secondResult.alreadyExisted).toBe(true);
      expect(secondResult.setId).toBe(firstResult.setId);
      expect(secondResult.cards.length).toBe(testCardsFromLLM.length);

      const cardsInSet = await tradingCards.cards.findBySetId(firstResult.setId);
      expect(cardsInSet.length).toBe(testCardsFromLLM.length);
    });
  });

  describe("different sports handling", () => {
    it("should create sets for different sports", async () => {
      const basketballFile = "/path/to/test-create-cards-basketball.xlsx";
      const footballFile = "/path/to/test-create-cards-football.xlsx";

      const basketballResult = await createCards(
        basketballFile,
        Sport.Basketball,
        testCardsFromLLM
      );
      const footballResult = await createCards(
        footballFile,
        Sport.Football,
        testCardsFromLLM
      );

      testSetIds.push(basketballResult.setId, footballResult.setId);
      testCardIds.push(
        ...basketballResult.cards.map((card) => card.id),
        ...footballResult.cards.map((card) => card.id)
      );

      expect(basketballResult.cards.length).toBe(testCardsFromLLM.length);
      expect(footballResult.cards.length).toBe(testCardsFromLLM.length);
      expect(basketballResult.setId).not.toBe(footballResult.setId);

      const basketballSet = await tradingCards.sets.findById(
        basketballResult.setId
      );
      const footballSet = await tradingCards.sets.findById(footballResult.setId);

      expect(basketballSet!.sport).toBe("Basketball");
      expect(footballSet!.sport).toBe("Football");
    });
  });

  describe("database integration", () => {
    it("should persist data correctly in database", async () => {
      const filePath = "/path/to/test-create-cards-persistence.xlsx";
      const sport = Sport.Basketball;

      const result = await createCards(filePath, sport, testCardsFromLLM);

      testSetIds.push(result.setId);
      testCardIds = result.cards.map((card) => card.id);

      const retrievedSet = await tradingCards.sets.findById(result.setId);
      const retrievedCards = await tradingCards.cards.findBySetId(result.setId);

      expect(retrievedSet).toBeDefined();
      expect(retrievedCards.length).toBe(testCardsFromLLM.length);
      expect(retrievedCards.every((card) => card.setId === result.setId)).toBe(
        true
      );
    });
  });
});
