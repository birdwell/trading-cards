import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { Sport } from '../types';

export const sets = sqliteTable('sets', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  year: text('year').notNull(),
  sourceFile: text('source_file').notNull(),
  sport: text('sport').notNull(),
});

export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey(),
  cardNumber: integer('card_number').notNull(),
  playerName: text('player_name').notNull(),
  cardType: text('card_type').notNull(),
  setId: integer('set_id').notNull().references(() => sets.id),
});

// Define relations
export const setsRelations = relations(sets, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  set: one(sets, {
    fields: [cards.setId],
    references: [sets.id],
  }),
}));
