import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TradeJournalEditLoader } from "@/components/journal/TradeJournalEditLoader";
import { getDashboardData } from "@/lib/data-sources";

export const dynamic = "force-dynamic";

export default async function EditJournalPage({ params }: { params: { id: string } }) {
  const data = await getDashboardData();

  return (
    <AppShell>
      <Link href={`/journal/${params.id}`} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={17} /> 상세
      </Link>
      <header className="mb-4">
        <p className="text-xs font-semibold text-muted">EDIT JOURNAL</p>
        <h1 className="mt-1 text-2xl font-bold">매매일지 수정</h1>
      </header>
      <TradeJournalEditLoader id={params.id} data={data} />
    </AppShell>
  );
}
