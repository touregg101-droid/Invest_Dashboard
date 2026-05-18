import type { CommunityPost } from "@/lib/data-sources/sentiment-adapter";

export async function analyzeSentimentWithAi(posts: CommunityPost[]) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      note: "OPENAI_API_KEY가 없어 adapter mock 분석을 사용합니다.",
      postsAnalyzed: posts.length
    };
  }

  return {
    note: "OpenAI sentiment adapter placeholder: 게시글 수집, 정제, 분류, 감정 분석, 키워드 추출 단계에 연결합니다.",
    postsAnalyzed: posts.length
  };
}
