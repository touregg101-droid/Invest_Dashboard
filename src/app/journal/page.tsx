import { AppShell } from "@/components/layout/AppShell";
import { TradeJournalListLoader } from "@/components/journal/TradeJournalListLoader";

export default function JournalPage() {
  return (
    <AppShell>
      <header className="mb-4">
        <p className="text-xs font-semibold text-muted">TRADE JOURNAL</p>
        <h1 className="mt-1 text-2xl font-bold">개인 매매일지</h1>
        <p className="mt-2 text-sm text-muted">판단 근거를 기록하고 나중에 복기합니다.</p>
      </header>
      <TradeJournalListLoader />
      <footer className="mt-4 text-xs leading-5 text-muted">
        이 매매일지는 사용자의 판단을 기록하고 복기하기 위한 도구입니다. 본 서비스는 매수·매도 추천을 제공하지 않으며, 기록된 내용은 투자 성과를 보장하지 않습니다.
      </footer>
    </AppShell>
  );
}
