import { eq } from "drizzle-orm";
import { cards, db, sets } from "../db";
import { tradingCards } from "../db/service";
import { Sport } from "../shared/types";

// Mock only the logger to avoid console noise during tests
jest.mock("../shared/logger");

describe("Card Deletion Tests", () => {
  let testSetId: number;
  let testCardIds: number[] = [];

  beforeEach(async () => {
    // Clean up any existing test data
    await db.delete(cards).where(eq(cards.cardNumber, 999));
    await db.delete(sets).where(eq(sets.name, "Test Delete Set"));

    // Create a test set
    const testSet = await tradingCards.sets.create({
      name: "Test Delete Set",
      year: "2024",
      sourceFile: "test-delete.xlsx",
      sport: Sport.Basketball,
    });
    testSetId = testSet.id;

    // Create test cards
    const testCards = await tradingCards.cards.create([
      {
        cardNumber: 999,
        playerName: "Test Player 1",
        cardType: "Base",
        setId: testSetId,
        isOwned: false,
      },
      {
        cardNumber: 998,
        playerName: "Test Player 2", 
        cardType: "Rookie",
        setId: testSetId,
        isOwned: true,
      },
    ]);
    testCardIds = testCards.map(card => card.id);
  });

  afterEach(async () => {
    // Clean up test data
    if (testCardIds.length > 0) {
      await db.delete(cards).where(eq(cards.setId, testSetId));
    }
    if (testSetId) {
      await db.delete(sets).where(eq(sets.id, testSetId));
    }
  });

  describe("delete card", () => {
    it("should successfully delete an existing card", async () => {
      const cardToDelete = testCardIds[0];
      
      // Verify card exists before deletion
      const cardBefore = await tradingCards.cards.findById(cardToDelete);
      expect(cardBefore).toBeDefined();
      
      // Delete the card
      const result = await tradingCards.cards.delete(cardToDelete);
      expect(result).toBe(true);
      
      // Verify card no longer exists
      const cardAfter = await tradingCards.cards.findById(cardToDelete);
      expect(cardAfter).toBeUndefined();
    });

    it("should handle deletion of non-existent card", async () => {
      const nonExistentCardId = 99999;
      
      // This should not throw an error, just return true
      const result = await tradingCards.cards.delete(nonExistentCardId);
      expect(result).toBe(true);
    });

    it("should not affect other cards when deleting one card", async () => {
      const cardToDelete = testCardIds[0];
      const cardToKeep = testCardIds[1];
      
      // Delete one card
      await tradingCards.cards.delete(cardToDelete);
      
      // Verify the other card still exists
      const remainingCard = await tradingCards.cards.findById(cardToKeep);
      expect(remainingCard).toBeDefined();
      expect(remainingCard!.playerName).toBe("Test Player 2");
    });

    it("should update set stats after card deletion", async () => {
      // Get initial stats
      const statsBefore = await tradingCards.getSetStats(testSetId);
      expect(statsBefore!.totalCards).toBe(2);
      expect(statsBefore!.ownedCards).toBe(1);
      
      // Delete the owned card
      const ownedCard = testCardIds[1]; // Test Player 2 is owned
      await tradingCards.cards.delete(ownedCard);
      
      // Get updated stats
      const statsAfter = await tradingCards.getSetStats(testSetId);
      expect(statsAfter!.totalCards).toBe(1);
      expect(statsAfter!.ownedCards).toBe(0);
    });
  });
});
