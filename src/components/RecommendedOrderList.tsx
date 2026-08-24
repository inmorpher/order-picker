'use client';

import { useRecommendedOrderStore } from '@/store/useRecommendedOrderStore';
import { ArrowDownUp, Check, ChevronRight, Filter, Minus, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';

interface Item {
	id: number;
	externalId: string;
	description: string;
	unit: string;
	dailyUsage: number;
}

export default function RecommendedOrderList({ items }: { items: Item[] }) {
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'selected' | 'needs'>('all');
	const [needsFirst, setNeedsFirst] = useState(false);
	const isHydrated = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
	const { deliveryDays, onHand, selectedItems, setDeliveryDays, setOnHand, setSelected } = useRecommendedOrderStore();

	const recommendations = useMemo(
		() =>
			items.map((item) => {
				const stock = onHand[item.externalId] ?? 0;
				const quantity = Math.ceil(Math.max(0, item.dailyUsage * deliveryDays - stock));
				return {
					...item,
					stock,
					quantity,
					selected: selectedItems[item.externalId] ?? stock > 0,
				};
			}),
		[deliveryDays, items, onHand, selectedItems],
	);

	const filteredItems = recommendations.filter(
		(item) =>
			item.description.toLowerCase().includes(search.toLowerCase()) ||
			item.externalId.includes(search),
	);
	const visibleItems = filteredItems.filter((item) => {
		if (filter === 'selected') return item.selected;
		if (filter === 'needs') return item.selected && item.quantity > 0;
		return true;
	}).sort((a, b) => {
		if (needsFirst && a.quantity !== b.quantity) return Number(b.quantity > 0) - Number(a.quantity > 0);
		return a.description.localeCompare(b.description);
	});
	const itemsToOrder = recommendations.filter((item) => item.selected).length;
	const itemsNeedingOrder = recommendations.filter((item) => item.quantity > 0).length;
	const selectItemsNeedingOrder = () => {
		recommendations
			.filter((item) => item.quantity > 0)
			.forEach((item) => setSelected(item.externalId, true));
	};

	const changeOnHand = (id: string, amount: number) => {
		setOnHand(id, Math.max(0, (onHand[id] ?? 0) + amount));
	};

	if (!isHydrated) return null;

	return (
		<div className='flex flex-col gap-4 pb-32'>
			<section className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm'>
				<h2 className='text-sm font-black uppercase tracking-widest text-slate-400 mb-3'>Order coverage</h2>
				<div className='grid grid-cols-2 gap-3'>
					{[
						{ days: 1 as const, label: 'Tomorrow' },
						{ days: 2 as const, label: 'Day after tomorrow' },
					].map((option) => (
						<button
							key={option.days}
							type='button'
							onClick={() => setDeliveryDays(option.days)}
							className={`p-3 rounded-2xl border font-bold transition-all ${
								deliveryDays === option.days
									? 'bg-teal-600 border-teal-600 text-white'
									: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			</section>

			<div className='sticky top-[73px] z-10 -mx-4 px-4 py-2 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
					<input
						type='text'
						placeholder='Search items...'
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className='w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none'
					/>
					{search && (
						<button type='button' onClick={() => setSearch('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
							<X size={18} />
						</button>
					)}
				</div>
				<div className='flex items-center gap-2 overflow-x-auto pt-2'>
					<Filter size={15} className='shrink-0 text-slate-400' />
					{[
						{ value: 'all' as const, label: 'All' },
						{ value: 'selected' as const, label: 'Selected' },
						{ value: 'needs' as const, label: 'Needs ordering' },
					].map((option) => (
						<button
							key={option.value}
							type='button'
							onClick={() => setFilter(option.value)}
							className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
								filter === option.value
									? 'bg-teal-600 text-white'
									: 'bg-white text-slate-500 dark:bg-slate-900'
							}`}
						>
							{option.label}
						</button>
					))}
					<button
						type='button'
						onClick={selectItemsNeedingOrder}
						disabled={itemsNeedingOrder === 0}
						className='ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold text-teal-700 disabled:opacity-40 dark:bg-teal-900/30 dark:text-teal-300'
					>
						<Check size={13} /> Select needed
					</button>
				</div>
				<button
					type='button'
					onClick={() => setNeedsFirst((current) => !current)}
					className='mt-2 flex items-center gap-1 text-xs font-bold text-slate-500'
				>
					<ArrowDownUp size={13} /> {needsFirst ? 'Needs ordering first' : 'Sorted by name'}
				</button>
			</div>

			<div className='flex flex-col gap-2'>
				{visibleItems.length > 0 ? visibleItems.map((item) => (
					<div
						key={item.id}
						className={`p-4 rounded-2xl border transition-all ${
							item.selected
								? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800'
								: 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
						}`}
					>
						<div className='flex items-center justify-between gap-3'>
							<button
								type='button'
								onClick={() => setSelected(item.externalId, !item.selected)}
								className='min-w-0 text-left'
								aria-pressed={item.selected}
							>
								<p className='font-bold text-slate-900 dark:text-white truncate'>{item.description}</p>
								<div className='flex items-center gap-2 mt-1'>
									<span className='text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono'>
										#{item.externalId}
									</span>
									<span className='text-xs text-slate-500'>{item.dailyUsage} per day · {item.unit}</span>
								</div>
							</button>
							<button
								type='button'
								onClick={() => setSelected(item.externalId, !item.selected)}
								className='text-right shrink-0'
								aria-pressed={item.selected}
							>
								<p className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>
									{item.dailyUsage === 0
										? 'Usage not set'
										: item.quantity > 0
											? 'Needs ordering'
											: item.selected
												? 'Enough stock'
												: 'Tap to select'}
								</p>
								<p className={`font-black text-lg ${item.selected && item.quantity > 0 ? 'text-teal-600' : 'text-slate-400'}`}>
									{item.selected ? `${item.quantity} ${item.unit}` : '—'}
								</p>
							</button>
						</div>
						<div className='flex items-center justify-between mt-3'>
							<div className='flex items-center gap-2'>
								<span className='text-xs font-semibold text-slate-500'>On hand</span>
								{item.stock === 0 && (
									<span className='text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400'>
										Out of stock
									</span>
								)}
							</div>
							<div className='flex items-center gap-1'>
								<button type='button' onClick={() => changeOnHand(item.externalId, -1)} className='w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'>
									<Minus size={17} />
								</button>
								<input
									type='number'
									min='0'
									step='0.01'
									value={onHand[item.externalId] ?? ''}
									onChange={(event) => setOnHand(item.externalId, Math.max(0, Number(event.target.value) || 0))}
									className='w-20 h-9 px-2 text-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500'
									aria-label={`${item.description} stock on hand`}
								/>
								<button type='button' onClick={() => changeOnHand(item.externalId, 1)} className='w-9 h-9 flex items-center justify-center rounded-lg bg-teal-600 text-white'>
									<Plus size={17} />
								</button>
							</div>
						</div>
					</div>
				)) : (
					<div className='rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500 dark:border-slate-700'>
						No items match this filter.
					</div>
				)}
			</div>

			<div className='fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800'>
				<div className='max-w-md mx-auto flex items-center justify-between gap-4'>
					<div>
						<span className='text-xs text-slate-500 uppercase font-bold tracking-tighter'>Recommended</span>
						<p className='text-xl font-bold dark:text-white'>{itemsToOrder} selected</p>
					</div>
					<Link
						href='/recommended-order/summary'
						className={`flex items-center gap-2 py-4 px-6 rounded-2xl font-bold ${
							itemsToOrder > 0 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 pointer-events-none'
						}`}
					>
						Review <ChevronRight size={20} />
					</Link>
				</div>
			</div>
		</div>
	);
}
