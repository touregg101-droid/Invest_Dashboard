import type { TradeJournal } from "@/types/journal";

export interface TradeJournalRepository {
  list(): Promise<TradeJournal[]>;
  get(id: string): Promise<TradeJournal | null>;
  create(entry: TradeJournal): Promise<TradeJournal>;
  update(id: string, entry: Partial<TradeJournal>): Promise<TradeJournal>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}
