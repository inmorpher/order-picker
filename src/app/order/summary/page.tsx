import { db } from '@/db';
import { items } from '@/db/schema';
import SummaryClient from '@/components/SummaryClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SummaryPage() {
  const allItems = await db.select({
    externalId: items.externalId,
    description: items.description,
    unit: items.unit
  }).from(items);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
        <Link href="/order" className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h1>
      </header>

      <div className="p-4">
        <SummaryClient allItems={allItems} />
      </div>
    </main>
  );
}
