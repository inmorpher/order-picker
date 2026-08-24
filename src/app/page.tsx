import { History, Plus, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<main className='min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col gap-6 max-w-md mx-auto'>
			<header className='py-8'>
				<h1 className='text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
					Order Picker
				</h1>
				<p className='text-slate-500 font-medium'>Inventory Management System</p>
			</header>

			<section className='flex flex-col gap-3'>
				<p className='ml-1 text-xs font-black uppercase tracking-widest text-slate-400'>Ordering</p>
				<Link
					href='/order'
					className='group flex items-center gap-5 bg-white p-5 rounded-2xl text-slate-900 border border-indigo-200 shadow-sm active:scale-[0.98] transition-all duration-200 dark:bg-slate-900 dark:text-white dark:border-indigo-900'
				>
					<div className='p-4 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-200 transition-colors dark:bg-indigo-900/40 dark:text-indigo-300'>
						<Plus size={28} strokeWidth={3} />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>New Order</h2>
						<p className='text-slate-500 text-sm font-medium'>Pick items manually</p>
					</div>
				</Link>

				<Link
					href='/recommended-order'
					className='group flex items-center gap-5 bg-white p-5 rounded-2xl text-slate-900 border border-teal-200 shadow-sm active:scale-[0.98] transition-all duration-200 dark:bg-slate-900 dark:text-white dark:border-teal-900'
				>
					<div className='p-4 bg-teal-100 text-teal-600 rounded-xl group-hover:bg-teal-200 transition-colors dark:bg-teal-900/40 dark:text-teal-300'>
						<Sparkles size={28} strokeWidth={3} />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>Recommended Order</h2>
						<p className='text-slate-500 text-sm font-medium'>Calculate from daily usage</p>
					</div>
				</Link>
			</section>

			<section className='flex flex-col gap-3'>
				<p className='ml-1 text-xs font-black uppercase tracking-widest text-slate-400'>Inventory</p>
				<Link
					href='/history'
					className='flex items-center gap-5 bg-white dark:bg-slate-900 p-5 rounded-2xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all duration-200'
				>
					<div className='p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl'>
						<History size={32} className='text-slate-600 dark:text-slate-400' />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>History</h2>
						<p className='text-slate-500 text-sm font-medium'>Past order logs</p>
					</div>
				</Link>

				<Link
					href='/items'
					className='flex items-center gap-5 bg-white dark:bg-slate-900 p-5 rounded-2xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all duration-200'
				>
					<div className='p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl'>
						<Settings size={32} className='text-slate-600 dark:text-slate-400' />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>Items</h2>
						<p className='text-slate-500 text-sm font-medium'>Manage inventory list</p>
					</div>
				</Link>
			</section>
		</main>
	);
}
