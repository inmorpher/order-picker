import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
  items: Record<string, number>; // externalId -> quantity
  setQuantity: (id: string, qty: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  reset: () => void;
  getTotalItemsCount: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: {},
      setQuantity: (id, qty) => set((state) => ({
        items: { ...state.items, [id]: Math.max(0, qty) }
      })),
      increment: (id) => set((state) => ({
        items: { ...state.items, [id]: (state.items[id] || 0) + 1 }
      })),
      decrement: (id) => set((state) => ({
        items: { ...state.items, [id]: Math.max(0, (state.items[id] || 0) - 1) }
      })),
      reset: () => set({ items: {} }),
      getTotalItemsCount: () => Object.values(get().items).reduce((acc, q) => acc + (q > 0 ? 1 : 0), 0),
    }),
    {
      name: 'order-storage',
    }
  )
);
