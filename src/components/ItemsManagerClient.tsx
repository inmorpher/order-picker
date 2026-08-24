'use client';

import { useState } from 'react';
import { addItem, toggleItemStatus, updateDailyUsage } from '@/app/actions';
import { Plus, Trash2, Eye, EyeOff, Package, Hash, Weight } from 'lucide-react';

interface Item {
  id: number;
  externalId: string;
  description: string;
  unit: string;
  dailyUsage: number;
  isActive: boolean;
}

export default function ItemsManagerClient({ initialItems }: { initialItems: Item[] }) {
  const [description, setDescription] = useState('');
  const [externalId, setExternalId] = useState('');
  const [unit, setUnit] = useState('CS');
  const [isAdding, setIsAdding] = useState(false);
  const [usageValues, setUsageValues] = useState<Record<number, string>>({});

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const res = await addItem(description, externalId, unit);
    if (res.success) {
      setDescription('');
      setExternalId('');
      setUnit('CS');
    } else {
      alert(res.error);
    }
    setIsAdding(false);
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const res = await toggleItemStatus(id, currentStatus);
    if (!res.success) alert(res.error);
  };

  const handleUsageUpdate = async (id: number, value: string) => {
    const dailyUsage = Number(value);
    const res = await updateDailyUsage(id, dailyUsage);
    if (!res.success) {
      alert(res.error);
      return;
    }
    setUsageValues((current) => ({ ...current, [id]: value }));
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Add Item Form */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Add New Item</h2>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Item name (e.g. Avocado)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="ID #"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
                required
              />
            </div>
            <div className="relative">
              <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Unit (CS, Case...)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all uppercase"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          ADD ITEM
        </button>
      </form>

      {/* Items List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Current Inventory</h2>
        {initialItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              item.isActive
                ? 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                : 'bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60'
            }`}
          >
            <div className="flex-1 min-w-0 pr-4">
              <p className={`font-bold truncate ${item.isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 line-through'}`}>
                {item.description}
              </p>
              <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>#{item.externalId}</span>
                <span>•</span>
                <span>{item.unit}</span>
              </div>
              <label className="flex items-center gap-2 mt-3 text-xs font-semibold text-slate-500">
                Daily usage
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={usageValues[item.id] ?? item.dailyUsage}
                  onChange={(e) => setUsageValues((current) => ({ ...current, [item.id]: e.target.value }))}
                  onBlur={(e) => handleUsageUpdate(item.id, e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span>per day</span>
              </label>
            </div>

            <button
              onClick={() => handleToggle(item.id, item.isActive)}
              className={`p-3 rounded-xl transition-all active:scale-90 ${
                item.isActive
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
              }`}
              title={item.isActive ? 'Deactivate' : 'Activate'}
            >
              {item.isActive ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
