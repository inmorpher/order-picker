import { db } from '@/db';
import { orders, orderItems, items } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, Calendar, User, Package, Download } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = parseInt(id);
  
  if (isNaN(orderId)) return notFound();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) return notFound();

  const details = await db
    .select({
      description: items.description,
      quantity: orderItems.quantity,
      unit: items.unit,
      externalId: items.externalId,
    })
    .from(orderItems)
    .innerJoin(items, eq(orderItems.itemId, items.id))
    .where(eq(orderItems.orderId, orderId));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/history" className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Order #{order.id}</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {/* Order Info Card */}
        <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl">
                <User size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Ordered by</p>
                <p className="text-2xl font-black tracking-tight">{order.ordererName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Calendar size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Date & Time</p>
                <p className="text-lg font-bold tracking-tight">
                  {format(order.createdAt, 'MMMM d, yyyy • HH:mm')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
              <Package size={14} />
              Order Content ({details.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {details.map((item) => (
              <div key={item.externalId} className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{item.description}</p>
                  <p className="text-xs text-slate-500 font-mono">#{item.externalId}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-black text-lg">
                  x{item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg active:scale-95 transition-all">
          <Download size={20} />
          EXPORT AS PDF (SOON)
        </button>
      </div>
    </main>
  );
}
