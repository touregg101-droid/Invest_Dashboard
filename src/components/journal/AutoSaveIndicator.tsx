"use client";

export function AutoSaveIndicator({ savedAt }: { savedAt?: string }) {
  return (
    <p className="caption">
      {savedAt ? `임시 저장됨 · ${new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}` : "작성 내용은 이 브라우저에 임시 저장됩니다."}
    </p>
  );
}
