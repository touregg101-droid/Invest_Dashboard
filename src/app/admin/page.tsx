import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DataCollectionLogPanel } from "@/components/cards/DataCollectionLogPanel";
import { AppShell } from "@/components/layout/AppShell";
import { getDashboardData } from "@/lib/data-sources";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getDashboardData();
  const failedSources = data.logs.filter((log) => log.status !== "success");

  return (
    <AppShell>
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={17} /> 홈
      </Link>
      <header className="mb-4">
        <p className="text-xs font-semibold text-muted">ADMIN</p>
        <h1 className="mt-1 text-2xl font-bold">데이터 수집 관리</h1>
        <p className="mt-2 text-sm text-muted">mock 사용 여부, 최근 수집 로그, 실패한 소스를 확인합니다.</p>
      </header>
      <div className="grid gap-4">
        <section className="card p-4">
          <h2 className="section-title">현재 데이터 모드</h2>
          <p className="mt-2 text-sm text-muted">
            USE_MOCK_DATA={process.env.USE_MOCK_DATA ?? "true"} · 실데이터 adapter 실패 시 mock fallback이 자동 적용됩니다.
          </p>
        </section>
        <section className="card p-4">
          <h2 className="section-title">실패 또는 fallback 소스</h2>
          <div className="mt-3 grid gap-2">
            {failedSources.length ? failedSources.map((log) => (
              <p key={log.id} className="rounded-md bg-surface p-3 text-sm">{log.jobName}: {log.message}</p>
            )) : <p className="caption">실패 로그가 없습니다.</p>}
          </div>
        </section>
        <DataCollectionLogPanel logs={data.logs} />
      </div>
    </AppShell>
  );
}
