import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  externalId: text('external_id').unique().notNull(),
  description: text('description').notNull(),
  unit: text('unit').notNull(),
  category: text('category'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  ordererName: text('orderer_name').notNull(),
  status: text('status', { enum: ['draft', 'completed'] }).default('completed').notNull(),
  totalItemsCount: integer('total_items_count').notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: real('quantity').notNull(),
});
