import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: text("year").notNull(),
  sourceFile: text("source_file").notNull(),
  sport: text("sport").notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  cardNumber: integer("card_number").notNull(),
  playerName: text("player_name").notNull(),
  cardType: text("card_type").notNull(),
  setId: integer("set_id")
    .notNull()
    .references(() => sets.id, { onDelete: "cascade" }),
});

export const userCards = pgTable(
  "user_cards",
  {
    userId: text("user_id").notNull(),
    cardId: integer("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    ownedAt: timestamp("owned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cardId] })]
);

export const setsRelations = relations(sets, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  set: one(sets, {
    fields: [cards.setId],
    references: [sets.id],
  }),
  ownerships: many(userCards),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  card: one(cards, {
    fields: [userCards.cardId],
    references: [cards.id],
  }),
}));
