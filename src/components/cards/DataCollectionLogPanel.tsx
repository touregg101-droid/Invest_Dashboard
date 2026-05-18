import type { CollectionLog } from "@/types";

export function DataCollectionLogPanel({ logs }: { logs: CollectionLog[] }) {
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title">관리자 수집 상태</h2>
          <p className="caption">수동 실행 버튼은 API route를 호출합니다.</p>
        </div>
        <form action="/api/collect" method="post">
          <button className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white">수집 실행</button>
        </form>
      </div>
      <div className="mt-3 grid gap-2">
        {logs.map((log) => (
          <div key={log.id} className="rounded-md border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{log.jobName}</p>
              <span className="rounded-full bg-surface px-2 py-1 text-[11px]">{log.status}</span>
            </div>
            <p className="mt-1 caption">{log.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
