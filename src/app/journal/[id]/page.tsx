import { AppShell } from "@/components/layout/AppShell";
import { TradeJournalDetail } from "@/components/journal/TradeJournalDetail";

export default function JournalDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <TradeJournalDetail id={params.id} />
    </AppShell>
  );
}
