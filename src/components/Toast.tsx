'use client';

interface ToastProps {
	message: string;
	actionLabel?: string;
	onAction?: () => void;
	onClose: () => void;
}

export default function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
	return (
		<div className='fixed bottom-24 left-4 right-4 z-30 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl'>
			<span>{message}</span>
			<div className='flex shrink-0 items-center gap-3'>
				{actionLabel && onAction && (
					<button type='button' onClick={onAction} className='font-black text-teal-300'>
						{actionLabel}
					</button>
				)}
				<button type='button' onClick={onClose} className='text-slate-300' aria-label='Close notification'>
					×
				</button>
			</div>
		</div>
	);
}
