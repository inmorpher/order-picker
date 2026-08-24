interface RecommendedOrderProgressProps {
	currentStep: 1 | 2 | 3;
}

const steps = ['Delivery', 'Items', 'Review'];

export default function RecommendedOrderProgress({ currentStep }: RecommendedOrderProgressProps) {
	return (
		<nav
			aria-label='Recommended order progress'
			className='px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70'
		>
			<div className='max-w-md mx-auto grid grid-cols-3 gap-2'>
				{steps.map((label, index) => {
					const step = (index + 1) as 1 | 2 | 3;
					const isCurrent = step === currentStep;
					const isComplete = step < currentStep;

					return (
						<div key={label} className='flex flex-col items-center gap-2'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
									isCurrent || isComplete
										? 'bg-emerald-600 text-white'
										: 'bg-slate-100 dark:bg-slate-800 text-slate-400'
								}`}
							>
								{step}
							</div>
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${
									isCurrent ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400'
								}`}
							>
								{label}
							</span>
						</div>
					);
				})}
			</div>
		</nav>
	);
}
