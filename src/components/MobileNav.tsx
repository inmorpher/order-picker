import { ClipboardList, History, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

const links = [
	{ href: '/order', label: 'Order', icon: ClipboardList },
	{ href: '/recommended-order', label: 'Recommend', icon: Sparkles },
	{ href: '/history', label: 'History', icon: History },
	{ href: '/items', label: 'Items', icon: Package },
];

export default function MobileNav() {
	return (
		<nav className='fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95'>
			<div className='mx-auto grid max-w-md grid-cols-4 gap-1'>
				{links.map(({ href, label, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						className='flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold text-slate-500 transition-colors active:bg-slate-100 dark:active:bg-slate-800'
					>
						<Icon size={19} />
						{label}
					</Link>
				))}
			</div>
		</nav>
	);
}
