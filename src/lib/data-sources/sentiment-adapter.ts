import { mockDashboardData } from "@/data/mock/dashboard";
import type { SentimentResult } from "@/types";

export interface CommunityPost {
  id: string;
  source: string;
  text: string;
  createdAt: string;
}

export interface SentimentAdapter {
  fetchCommunityPosts(ticker: string): Promise<CommunityPost[]>;
  analyzeSentiment(posts: CommunityPost[], ticker: string): Promise<SentimentResult>;
}

export class MockSentimentAdapter implements SentimentAdapter {
  async fetchCommunityPosts(ticker: string) {
    return [
      { id: `${ticker}-1`, source: "mock-community", text: "실적과 수급을 같이 보자는 의견", createdAt: new Date().toISOString() }
    ];
  }

  async analyzeSentiment(_posts: CommunityPost[], ticker: string) {
    const found = mockDashboardData.stocks.find((item) => item.stock.ticker === ticker);
    if (!found) throw new Error(`Unknown ticker: ${ticker}`);
    return found.sentiment;
  }
}

export class RealSentimentAdapter implements SentimentAdapter {
  async fetchCommunityPosts(): Promise<CommunityPost[]> {
    throw new Error("Community crawling is disabled until a compliant source or API is configured.");
  }

  async analyzeSentiment(): Promise<SentimentResult> {
    throw new Error("Real sentiment analysis requires fetched posts and an AI or local model provider.");
  }
}

export async function getSentiment(ticker: string) {
  const adapter = process.env.USE_MOCK_DATA === "false" ? new RealSentimentAdapter() : new MockSentimentAdapter();
  try {
    const posts = await adapter.fetchCommunityPosts(ticker);
    return await adapter.analyzeSentiment(posts, ticker);
  } catch {
    const fallback = new MockSentimentAdapter();
    return fallback.analyzeSentiment([], ticker);
  }
}
