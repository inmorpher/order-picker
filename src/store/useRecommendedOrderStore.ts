import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecommendedOrderState {
	deliveryDays: 1 | 2;
	onHand: Record<string, number>;
	selectedItems: Record<string, boolean>;
	quantityOverrides: Record<string, number>;
	hasHydrated: boolean;
	setDeliveryDays: (days: 1 | 2) => void;
	setOnHand: (id: string, quantity: number) => void;
	setSelected: (id: string, selected: boolean) => void;
	setQuantityOverride: (id: string, quantity: number) => void;
	setHasHydrated: (value: boolean) => void;
	reset: () => void;
}

export const useRecommendedOrderStore = create<RecommendedOrderState>()(
	persist(
		(set) => ({
			deliveryDays: 1,
			onHand: {},
			selectedItems: {},
			quantityOverrides: {},
			hasHydrated: false,
			setDeliveryDays: (deliveryDays) => set({ deliveryDays, quantityOverrides: {} }),
			setOnHand: (id, quantity) =>
				set((state) => ({
					onHand: { ...state.onHand, [id]: Math.max(0, quantity) },
					selectedItems:
						quantity > 0
							? { ...state.selectedItems, [id]: true }
							: state.selectedItems,
				})),
			setSelected: (id, selected) =>
				set((state) => ({
					selectedItems: { ...state.selectedItems, [id]: selected },
				})),
			setQuantityOverride: (id, quantity) =>
				set((state) => ({
					quantityOverrides: {
						...state.quantityOverrides,
						[id]: Math.max(0, quantity),
					},
				})),
			setHasHydrated: (hasHydrated) => set({ hasHydrated }),
			reset: () => set({ deliveryDays: 1, onHand: {}, selectedItems: {}, quantityOverrides: {} }),
		}),
		{
			name: 'recommended-order-storage',
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
