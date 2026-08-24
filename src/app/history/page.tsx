import { db } from '@/db';
import { orders } from '@/db/schema';
import { format } from 'date-fns';
import { desc } from 'drizzle-orm';
import { ArrowLeft, Calendar, ChevronRight, Package, User } from 'lucide-react';
import Link from 'next/link';

export default async function HistoryPage() {
	const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

	return (
		<main className='min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto'>
			<header className='sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4'>
				<Link href='/' className='p-2 -ml-2 text-slate-600 dark:text-slate-400'>
					<ArrowLeft size={24} />
				</Link>
				<h1 className='text-xl font-bold text-slate-900 dark:text-white'>Order History</h1>
			</header>

			<div className='p-4 flex flex-col gap-3'>
				{allOrders.length > 0 ? (
					allOrders.map((order) => (
						<Link
							key={order.id}
							href={`/history/${order.id}`}
							className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group'
						>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center gap-2 text-slate-400'>
									<Calendar size={14} />
									<span className='text-xs font-bold uppercase tracking-wider'>
										{format(order.createdAt, 'MMM d, yyyy • HH:mm')}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<div className='w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
										<User size={16} />
									</div>
									<h3 className='font-black text-lg text-slate-900 dark:text-white tracking-tight'>
										{order.ordererName}
									</h3>
								</div>
								<div className='flex items-center gap-1.5 text-slate-500'>
									<Package size={14} />
									<span className='text-sm font-medium'>
										{order.totalItemsCount} products selected
									</span>
								</div>
							</div>
							<div className='p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors'>
								<ChevronRight size={20} />
							</div>
						</Link>
					))
				) : (
					<div className='text-center py-20'>
						<div className='w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400'></div>
						<h2 className='text-xl font-bold text-slate-900 dark:text-white'>No history yet</h2>
						<p className='text-slate-500 text-sm mt-1'>Your past orders will appear here.</p>
					</div>
				)}
			</div>
		</main>
	);
}
