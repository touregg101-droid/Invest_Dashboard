# 한국 주식 분석 웹앱

TIGER 200(102110), 삼성전자(005930), SK하이닉스(000660)를 고정 비교하는 모바일 중심 주식 분석 대시보드입니다. 가격, 수급, 커뮤니티 감정, 한국 시장 공포-탐욕 지수, 가치분석, 증권사 리서치 요약을 한 흐름에서 확인하도록 구성했습니다.

> 본 서비스는 투자 판단을 보조하기 위한 정보 대시보드입니다. 매수·매도 추천을 제공하지 않으며, 모든 투자 판단과 책임은 사용자 본인에게 있습니다. 데이터는 지연되거나 오류가 있을 수 있습니다.

## 사용 기술

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- Adapter + mock fallback data layer
- localStorage 기반 개인 매매일지
- PWA manifest 기본 구조

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 환경변수

`.env.example`을 참고해 `.env.local`을 만들 수 있습니다.

```bash
USE_MOCK_DATA=true
OPENAI_API_KEY=
DATABASE_URL=
COLLECT_SECRET=change-me
```

## Mock Data 실행

기본값은 mock data입니다. 별도 API 키나 수동 업로드 없이 다음 항목이 즉시 표시됩니다.

- 3개 종목 가격 및 수익률
- 3개 종목 개인/기관/외국인 수급
- 3개 종목 커뮤니티 감정 분석
- 한국 시장 공포-탐욕 지수
- 삼성전자/SK하이닉스 가치분석
- TIGER 200 ETF 구성종목
- 증권사 리서치 보고서 샘플
- 관리자 수집 로그
- 개인 매매일지 작성, 복기, CSV/JSON 내보내기

## 개인 매매일지

하단 탭의 `일지` 또는 `/journal`에서 사용할 수 있습니다.

주요 기능:

- TIGER 200, 삼성전자, SK하이닉스별 판단 기록
- 판단 유형: 보유, 구매, 판매
- 판단 이유 최소 30자 검증
- 선택 입력: 매수가, 매도가, 수량, 목표가, 손절가, 투자 기간, 참고 근거, 감정 상태
- 작성 시점 snapshot 저장: 가격, 5일 수급, 감정 비율, 공포-탐욕 점수, 최신 리서치 요약
- 복기 입력: 실제 결과, 복기 메모, 배운 점, 다음 개선점, 결과 가격, 수익률, 보유 기간, 판단 점수
- 목록 필터: 종목, 판단 유형, 기간, 검색, 작성일/판단일 정렬
- CSV/JSON 내보내기

현재 1차 버전은 로그인 없이 브라우저 `localStorage`에 저장합니다. 기기나 브라우저를 바꾸면 자동 동기화되지 않으므로 내보내기 기능으로 백업할 수 있습니다.

저장소는 repository 패턴으로 추상화되어 있습니다.

- `src/lib/journal/journal-repository.ts`
- `src/lib/journal/local-journal-repository.ts`
- 향후 Supabase Auth + RLS 기반 repository로 교체 가능

## Real Data 전환

`USE_MOCK_DATA=false`로 전환하면 real adapter를 우선 호출합니다. 현재 실제 연동된 영역은 pykrx KRX 기반 삼성전자/SK하이닉스 일봉, Yahoo Finance chart API 기반 TIGER 200 가격 fallback, KOSPI/KOSDAQ/원달러 기반 합성 공포-탐욕 지수입니다. 수급, 커뮤니티, 리서치, 재무/ETF 세부 데이터는 약관과 공급자 확인 전이므로 mock fallback을 사용합니다.

실연동 시 각 adapter 파일에 합법적 API 또는 계약된 데이터 공급자를 연결하세요.

- `src/lib/data-sources/price-adapter.ts` 실제 연동: Supabase `price_daily`의 pykrx KRX 일봉 우선 사용, `102110.KS`는 Yahoo fallback
- `src/lib/data-sources/investor-flow-adapter.ts`
- `src/lib/data-sources/sentiment-adapter.ts`
- `src/lib/data-sources/fundamentals-adapter.ts`
- `src/lib/data-sources/research-adapter.ts`
- `src/lib/data-sources/fear-greed-calculator.ts` 실제 연동: `^KS11`, `^KQ11`, `KRW=X` 기반 합성 지수

각 데이터에는 `source`, `fetchedAt`, `confidenceLevel`, `usesMockData`를 포함하도록 설계했습니다.

## 데이터 소스별 주의사항

- KRX/한국거래소: 공개 다운로드 또는 API 사용 조건 확인 필요
- DART Open API: 재무제표와 공시 데이터에 적합하나 기업 코드 매핑 필요
- 네이버 금융/종목토론방: 직접 크롤링은 약관과 robots 정책 확인 필요
- FnGuide/CompanyGuide: 공개 화면과 라이선스 범위 확인 필요
- 증권사 리서치: 원문 전체 복제 금지, 링크와 짧은 요약 중심 권장
- Yahoo Finance/FinanceDataReader/pykrx: 한국 주식 데이터 정확도와 재배포 조건 확인 필요

## 자동 수집 구조

API route:

- `GET /api/collect`
- `POST /api/collect`
- `POST /api/summarize`
- `/journal`: 개인 매매일지
- `/journal/new`: 새 매매일지 작성
- `/journal/[id]`: 매매일지 상세 및 복기
- `/journal/[id]/edit`: 매매일지 수정

관리자 화면:

- `/admin`: mock 사용 여부, 최근 수집 로그, 실패/fallback 소스, 수동 수집 실행 버튼

권장 스케줄:

- 장 마감 후 가격/수급 갱신
- 매일 1회 커뮤니티 감정 분석
- 매일 1회 공포-탐욕 지수 산출
- 매일 1회 리서치 신규 여부 확인
- 분기별 실적 데이터 갱신

Vercel Cron, GitHub Actions, Supabase Scheduled Functions 중 하나로 `/api/collect`를 호출하면 됩니다. 수집 실패 시 이전 정상 데이터 유지와 실패 로그 저장을 DB 계층에 연결하면 됩니다.

`vercel.json`에는 평일 한국 장 마감 이후에 맞춘 예시 Cron이 포함되어 있습니다.

삼성전자/SK하이닉스 일봉은 GitHub Actions가 매일 한국시간 00:05에 `pykrx`를 설치해 Supabase에 저장합니다. 워크플로우는 `.github/workflows/collect-krx-prices.yml`에 있습니다.

## 데이터베이스

요구 테이블 스키마는 `src/lib/db/schema.sql`에 포함되어 있습니다. `trade_journals` 테이블도 확장 버전용으로 추가되어 있습니다.

## AI 요약 구조

AI 기능은 다음 파일에 추상화되어 있습니다.

- `src/lib/ai/summarize-report.ts`
- `src/lib/ai/analyze-sentiment.ts`
- `src/lib/ai/summarize-journal.ts`
- `src/lib/ai/summarize-review.ts`

프롬프트 원칙:

- 제공된 데이터만 사용
- 모르는 내용은 모른다고 표시
- 매수/매도 추천 금지
- 숫자 임의 생성 금지
- 출처 없는 정보 표시 금지

## 배포 방법

Vercel 기준:

1. 저장소를 Vercel에 연결
2. 환경변수 설정
3. Build command: `npm run build`
4. Output은 Next.js 기본값 사용
5. Cron으로 `/api/collect` 등록

자세한 게시/DB 저장 절차는 `DEPLOYMENT.md`를 참고하세요.

## 향후 개선 과제

- Supabase/PostgreSQL 영속 저장 연결
- DART 기업 코드 및 재무제표 adapter 구현
- 합법적 수급 데이터 공급자 연결
- 커뮤니티 데이터 수집 약관 검토 후 API 기반 수집
- OpenAI API를 이용한 감정/리서치 요약 실연동
- 관리자 화면 인증과 수집 실패 재시도 UI
- Supabase Auth를 붙인 사용자별 매매일지 동기화
- 매매일지 가져오기 기능
- Lighthouse/PWA 아이콘 세트 추가
