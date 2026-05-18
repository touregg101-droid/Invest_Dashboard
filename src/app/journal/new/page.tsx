import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TradeJournalForm } from "@/components/journal/TradeJournalForm";
import { getDashboardData } from "@/lib/data-sources";

export const dynamic = "force-dynamic";

export default async function NewJournalPage() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <Link href="/journal" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={17} /> 일지 목록
      </Link>
      <header className="mb-4">
        <p className="text-xs font-semibold text-muted">NEW JOURNAL</p>
        <h1 className="mt-1 text-2xl font-bold">새 매매일지 작성</h1>
      </header>
      <TradeJournalForm data={data} />
    </AppShell>
  );
}
