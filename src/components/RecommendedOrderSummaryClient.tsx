'use client';

import { submitOrder } from '@/app/actions';
import { useRecommendedOrderStore } from '@/store/useRecommendedOrderStore';
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useSyncExternalStore } from 'react';

interface Item {
	externalId: string;
	description: string;
	unit: string;
	dailyUsage: number;
}

export default function RecommendedOrderSummaryClient({ items }: { items: Item[] }) {
	const router = useRouter();
	const isHydrated = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
	const [ordererName, setOrdererName] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { deliveryDays, onHand, selectedItems, quantityOverrides, setDeliveryDays, setSelected, setQuantityOverride, reset } = useRecommendedOrderStore();

	const orderItems = useMemo(
		() =>
			items
				.map((item) => {
					const calculatedQuantity = Math.ceil(Math.max(0, item.dailyUsage * deliveryDays - (onHand[item.externalId] ?? 0)));
					return {
						...item,
						selected: selectedItems[item.externalId] ?? (onHand[item.externalId] ?? 0) > 0,
						quantity: quantityOverrides[item.externalId] ?? calculatedQuantity,
					};
				})
				.filter((item) => item.selected),
		[deliveryDays, items, onHand, quantityOverrides, selectedItems],
	);

	const changeQuantity = (id: string, current: number, amount: number) => {
		setQuantityOverride(id, Math.max(0, current + amount));
	};

	const handleSubmit = async () => {
		if (!ordererName.trim()) {
			alert('Please enter your name');
			return;
		}
		const itemsToSubmit = orderItems.filter((item) => item.quantity > 0);
		if (itemsToSubmit.length === 0) {
			alert('No items selected');
			return;
		}

		setIsSubmitting(true);
		const result = await submitOrder(
			Object.fromEntries(itemsToSubmit.map((item) => [item.externalId, item.quantity])),
			ordererName,
			'recommended',
		);
		if (result.success) {
			reset();
			router.push('/');
			router.refresh();
		} else {
			alert(result.error || 'Something went wrong');
			setIsSubmitting(false);
		}
	};

	if (!isHydrated) return null;

	return (
		<div className='flex flex-col gap-6 pb-32'>
			<Link href='/recommended-order' className='flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400'>
				<ArrowLeft size={18} /> Back to selection
			</Link>
			<div className='bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5'>
				<p className='text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300'>Review</p>
				<p className='text-sm text-emerald-800 dark:text-emerald-200 mt-1'>Calculated for {deliveryDays} day{deliveryDays === 1 ? '' : 's'} of usage. You can adjust any quantity before saving.</p>
				<div className='grid grid-cols-2 gap-2 mt-4'>
					{[
						{ days: 1 as const, label: 'Tomorrow' },
						{ days: 2 as const, label: 'Day after tomorrow' },
					].map((option) => (
						<button
							key={option.days}
							type='button'
							onClick={() => setDeliveryDays(option.days)}
							className={`p-2 rounded-xl border text-sm font-bold transition-all ${
								deliveryDays === option.days
									? 'bg-emerald-600 border-emerald-600 text-white'
									: 'bg-white/70 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				{orderItems.map((item) => (
					<div key={item.externalId} className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4'>
						<div className='flex items-center justify-between gap-3'>
							<div className='min-w-0'>
								<p className='font-bold text-slate-900 dark:text-white truncate'>{item.description}</p>
								<p className='text-xs text-slate-500'>
									On hand: {onHand[item.externalId] ?? 0} {item.unit} · Calculated: {Math.ceil(Math.max(0, item.dailyUsage * deliveryDays - (onHand[item.externalId] ?? 0)))} {item.unit}
								</p>
							</div>
							<div className='flex items-center gap-1'>
								<button type='button' onClick={() => changeQuantity(item.externalId, item.quantity, -1)} className='w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'>
									<Minus size={17} />
								</button>
								<input
									type='number'
									min='0'
									step='1'
									value={item.quantity}
									onChange={(event) => setQuantityOverride(item.externalId, Number(event.target.value) || 0)}
									className='w-20 h-9 px-2 text-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500'
									aria-label={`${item.description} order quantity`}
								/>
								<button type='button' onClick={() => changeQuantity(item.externalId, item.quantity, 1)} className='w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white'>
									<Plus size={17} />
								</button>
							</div>
							<button
								type='button'
								onClick={() => setSelected(item.externalId, false)}
								className='text-xs font-bold text-red-600 dark:text-red-400'
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>

			<div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm'>
				<label className='block text-xs font-black text-slate-400 uppercase tracking-widest mb-2'>Your name</label>
				<div className='relative'>
					<User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
					<input type='text' placeholder='Enter your name...' value={ordererName} onChange={(event) => setOrdererName(event.target.value)} className='w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500' />
				</div>
			</div>

			<button type='button' onClick={handleSubmit} disabled={isSubmitting || !orderItems.some((item) => item.quantity > 0) || !ordererName.trim()} className='fixed bottom-0 left-0 right-0 mx-auto max-w-md m-4 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50'>
				{isSubmitting ? <Loader2 className='animate-spin' size={22} /> : <CheckCircle2 size={22} />}
				SAVE RECOMMENDED ORDER
			</button>
		</div>
	);
}
