'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { Minus, Plus, ChevronRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Item {
  id: number;
  externalId: string;
  description: string;
  unit: string;
}

export default function OrderList({ items }: { items: Item[] }) {
  const [search, setSearch] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const { items: selectedItems, increment, decrement, getTotalItemsCount } = useOrderStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.externalId.includes(search)
  );

  const totalCount = getTotalItemsCount();

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Search Bar */}
      <div className="sticky top-[73px] z-10 -mx-4 px-4 py-2 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const quantity = selectedItems[item.externalId] || 0;
            const isSelected = quantity > 0;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 ring-1 ring-indigo-100 dark:ring-indigo-900/40 shadow-sm'
                    : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className={`font-medium truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>
                    {item.description}
                  </h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">#{item.externalId}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrement(item.externalId)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:scale-90 transition-transform"
                  >
                    <Minus size={20} />
                  </button>
                  
                  <span className={`w-8 text-center font-bold text-lg ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {quantity}
                  </span>

                  <button
                    onClick={() => increment(item.externalId)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white active:scale-90 transition-transform shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">
            No items found matching &quot;{search}&quot;
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Summary</span>
            <span className="text-xl font-bold dark:text-white">{totalCount} items</span>
          </div>
          <Link
            href="/order/summary"
            className={`flex items-center gap-2 py-4 px-8 rounded-2xl font-bold transition-all ${
              totalCount > 0
                ? 'bg-indigo-600 text-white shadow-lg active:scale-95 hover:bg-indigo-700'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none'
            }`}
          >
            Review <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
