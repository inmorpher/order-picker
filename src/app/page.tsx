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
					className='group flex items-center gap-5 bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 transition-all duration-200'
				>
					<div className='p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors'>
						<Plus size={32} strokeWidth={3} />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>New Order</h2>
						<p className='text-indigo-100/80 text-sm font-medium'>Start picking items</p>
					</div>
				</Link>

				<Link
					href='/recommended-order'
					className='group flex items-center gap-5 bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all duration-200'
				>
					<div className='p-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors'>
						<Sparkles size={32} strokeWidth={3} />
					</div>
					<div>
						<h2 className='text-2xl font-bold'>Recommended Order</h2>
						<p className='text-emerald-100/80 text-sm font-medium'>Calculate what you need from stock</p>
					</div>
				</Link>
			</section>

			<section className='flex flex-col gap-3'>
				<p className='ml-1 text-xs font-black uppercase tracking-widest text-slate-400'>Inventory</p>
				<Link
					href='/history'
					className='flex items-center gap-5 bg-white dark:bg-slate-900 p-6 rounded-3xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all duration-200'
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
					className='flex items-center gap-5 bg-white dark:bg-slate-900 p-6 rounded-3xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all duration-200'
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
