import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto max-w-md px-4 pb-24 pt-4">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
