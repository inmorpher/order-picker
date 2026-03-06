'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { submitOrder } from '@/app/actions';
import { ArrowLeft, CheckCircle2, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Item {
  externalId: string;
  description: string;
  unit: string;
}

export default function SummaryClient({ allItems }: { allItems: Item[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [ordererName, setOrdererName] = useState('');
  const { items: selectedItems, reset } = useOrderStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const orderItems = allItems
    .filter(item => (selectedItems[item.externalId] || 0) > 0)
    .map(item => ({
      ...item,
      quantity: selectedItems[item.externalId]
    }));

  const handleFinish = async () => {
    if (!ordererName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    const result = await submitOrder(selectedItems, ordererName);
    
    if (result.success) {
      reset(); // Clear Zustand storage
      router.push('/');
      router.refresh();
    } else {
      alert(result.error || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your order is empty</h2>
        <p className="text-slate-500 mt-2 mb-6">Go back and select some items first.</p>
        <Link href="/order" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
          Back to Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-40">
      {/* Orderer Name Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
          Your Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Enter your name..."
            value={ordererName}
            onChange={(e) => setOrdererName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">Order Summary ({orderItems.length} items)</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {orderItems.map((item) => (
            <div key={item.externalId} className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{item.description}</p>
                <p className="text-xs text-slate-500">Unit: {item.unit}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl font-black text-lg">
                x{item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleFinish}
            disabled={isSubmitting || !ordererName.trim()}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <CheckCircle2 size={24} strokeWidth={3} />
                FINISH ORDER
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
