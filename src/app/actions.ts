'use server';

import { db } from '@/db';
import { orders, orderItems, items } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitOrder(selectedItems: Record<string, number>, ordererName: string) {
  const itemIds = Object.keys(selectedItems).filter(id => selectedItems[id] > 0);
  
  if (itemIds.length === 0) return { error: 'No items selected' };
  if (!ordererName.trim()) return { error: 'Please enter orderer name' };

  try {
    // Get item records to map externalId to our internal database id
    const itemRecords = await db.select({
      id: items.id,
      externalId: items.externalId
    }).from(items).where(inArray(items.externalId, itemIds));

    const [newOrder] = await db.insert(orders).values({
      createdAt: new Date(),
      ordererName: ordererName.trim(),
      status: 'completed',
      totalItemsCount: itemIds.length,
    }).returning({ id: orders.id });

    const itemsToInsert = itemRecords.map(item => ({
      orderId: newOrder.id,
      itemId: item.id,
      quantity: selectedItems[item.externalId],
    }));

    await db.insert(orderItems).values(itemsToInsert);

    revalidatePath('/history');
    return { success: true };
  } catch (e) {
    console.error('Failed to submit order:', e);
    return { error: 'Database error' };
  }
}

export async function addItem(description: string, externalId: string, unit: string) {
  if (!description || !externalId || !unit) return { error: 'All fields are required' };

  try {
    await db.insert(items).values({
      description,
      externalId,
      unit,
      isActive: true,
    });
    revalidatePath('/items');
    revalidatePath('/order');
    return { success: true };
  } catch (e) {
    console.error('Failed to add item:', e);
    return { error: 'Item already exists or database error' };
  }
}

export async function toggleItemStatus(id: number, currentStatus: boolean) {
  try {
    await db.update(items)
      .set({ isActive: !currentStatus })
      .where(eq(items.id, id));
    revalidatePath('/items');
    revalidatePath('/order');
    return { success: true };
  } catch (e) {
    console.error('Failed to toggle item status:', e);
    return { error: 'Database error' };
  }
}
