import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecommendedOrderState {
	deliveryDays: 1 | 2;
	onHand: Record<string, number>;
	quantityOverrides: Record<string, number>;
	setDeliveryDays: (days: 1 | 2) => void;
	setOnHand: (id: string, quantity: number) => void;
	setQuantityOverride: (id: string, quantity: number) => void;
	reset: () => void;
}

export const useRecommendedOrderStore = create<RecommendedOrderState>()(
	persist(
		(set) => ({
			deliveryDays: 1,
			onHand: {},
			quantityOverrides: {},
			setDeliveryDays: (deliveryDays) => set({ deliveryDays }),
			setOnHand: (id, quantity) =>
				set((state) => ({
					onHand: { ...state.onHand, [id]: Math.max(0, quantity) },
				})),
			setQuantityOverride: (id, quantity) =>
				set((state) => ({
					quantityOverrides: {
						...state.quantityOverrides,
						[id]: Math.max(0, quantity),
					},
				})),
			reset: () => set({ deliveryDays: 1, onHand: {}, quantityOverrides: {} }),
		}),
		{ name: 'recommended-order-storage' },
	),
);
