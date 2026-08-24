import { db } from '@/db';
import { items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import RecommendedOrderList from '@/components/RecommendedOrderList';
import RecommendedOrderProgress from '@/components/RecommendedOrderProgress';

export default async function RecommendedOrderPage() {
	const activeItems = await db
		.select({
			id: items.id,
			externalId: items.externalId,
			description: items.description,
			unit: items.unit,
			dailyUsage: items.dailyUsage,
		})
		.from(items)
		.where(eq(items.isActive, true));

	return (
		<main className='min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto'>
			<header className='sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4'>
				<Link href='/' className='p-2 -ml-2 text-slate-600 dark:text-slate-400'>
					<ArrowLeft size={24} />
				</Link>
				<h1 className='text-xl font-bold text-slate-900 dark:text-white'>Recommended Order</h1>
			</header>
			<RecommendedOrderProgress currentStep={2} />
			<div className='p-4'>
				<RecommendedOrderList items={activeItems} />
			</div>
		</main>
	);
}
