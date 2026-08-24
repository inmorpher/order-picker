interface RecommendedOrderProgressProps {
	currentStep: 1 | 2 | 3;
}

const steps = ['Delivery', 'Items', 'Review'];

export default function RecommendedOrderProgress({ currentStep }: RecommendedOrderProgressProps) {
	return (
		<nav
			aria-label='Recommended order progress'
			className='sticky top-[65px] z-20 px-4 py-4 border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95'
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
										? 'bg-teal-600 text-white'
										: 'bg-slate-100 dark:bg-slate-800 text-slate-400'
								}`}
							>
								{step}
							</div>
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${
									isCurrent ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'
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
