"use client";

import type { TradeJournalRepository } from "@/lib/journal/journal-repository";
import type { TradeJournal } from "@/types/journal";

const STORAGE_KEY = "investment-dashboard.trade-journals.v1";

export class LocalTradeJournalRepository implements TradeJournalRepository {
  async list() {
    return readEntries().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string) {
    return readEntries().find((entry) => entry.id === id) ?? null;
  }

  async create(entry: TradeJournal) {
    const entries = readEntries();
    writeEntries([entry, ...entries]);
    return entry;
  }

  async update(id: string, patch: Partial<TradeJournal>) {
    const entries = readEntries();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index < 0) throw new Error("매매일지를 찾을 수 없습니다.");
    const updated = { ...entries[index], ...patch, updatedAt: new Date().toISOString() };
    entries[index] = updated;
    writeEntries(entries);
    return updated;
  }

  async remove(id: string) {
    writeEntries(readEntries().filter((entry) => entry.id !== id));
  }

  async clear() {
    writeEntries([]);
  }
}

export const localJournalRepository = new LocalTradeJournalRepository();

function readEntries(): TradeJournal[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as TradeJournal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: TradeJournal[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
