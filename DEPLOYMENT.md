# 웹 게시 및 DB 저장 설정

이 프로젝트는 다음 구조를 기준으로 배포합니다.

- 웹 게시: Vercel
- DB: Supabase Postgres
- 자동 수집: Vercel Cron -> `/api/collect`
- 실제 데이터: Yahoo Finance 가격/시장지표 adapter + mock fallback
- DB 저장: Supabase REST API

## 1. Supabase DB 만들기

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor를 열고 `src/lib/db/schema.sql` 전체를 실행합니다.
3. Project Settings에서 아래 값을 확인합니다.
   - Project URL
   - service_role key
   - anon key

주의: `service_role key`는 서버 전용입니다. 브라우저 코드에 넣지 마세요.

## 2. Vercel에 웹 게시

1. GitHub에 이 프로젝트를 push합니다.
2. Vercel에서 `New Project`로 GitHub 저장소를 연결합니다.
3. Framework는 Next.js로 자동 인식됩니다.
4. Build command는 기본값 또는 `npm run build`를 사용합니다.
5. 환경변수를 설정합니다.

```bash
USE_MOCK_DATA=false
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
CRON_SECRET=random-long-secret
OPENAI_API_KEY=
```

## 3. 자동 수집

`vercel.json`에 Cron 예시가 들어 있습니다.

```json
{
  "crons": [
    {
      "path": "/api/collect",
      "schedule": "30 7 * * 1-5"
    }
  ]
}
```

Vercel Cron의 시간대는 UTC입니다. `30 7 * * 1-5`는 한국시간 16:30 평일 실행입니다.

Vercel 공식 문서 기준으로 `CRON_SECRET` 환경변수를 설정하면 Cron 요청에 `Authorization: Bearer <CRON_SECRET>` 헤더가 자동 포함됩니다. `/api/collect`는 production에서 이 헤더를 확인합니다.

수동 확인:

```bash
curl https://your-domain.vercel.app/api/collect \
  -H "Authorization: Bearer your-cron-secret"
```

## 4. DB 저장 확인

`/api/collect` 응답의 `database` 필드를 확인합니다.

성공 예:

```json
{
  "database": {
    "enabled": true,
    "ok": true,
    "message": "Supabase DB 저장 완료",
    "savedTables": ["stocks", "price_daily", "fear_greed_index"]
  }
}
```

환경변수가 없으면 앱은 깨지지 않고 DB 저장만 건너뜁니다.

```json
{
  "database": {
    "enabled": false,
    "ok": true,
    "message": "SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없어 DB 저장을 건너뜁니다."
  }
}
```

## 5. 현재 실제 수집 범위

실제 연동:

- 가격 데이터: `102110.KS`, `005930.KS`, `000660.KS`
- 공포-탐욕 합성 지수: `^KS11`, `^KQ11`, `KRW=X`

mock fallback:

- 개인/기관/외국인 수급
- 커뮤니티 감정
- 리서치 보고서
- 재무/ETF 세부 데이터

이 영역은 약관 위반 가능성이 있어 무리한 크롤링을 하지 않고 adapter만 준비한 상태입니다. 합법적 API 또는 계약된 데이터 공급자를 연결하면 동일한 DB 저장 흐름을 그대로 사용할 수 있습니다.

## 6. 모바일 사용

배포 후 사용자는 모바일 브라우저에서 Vercel 도메인에 접속하면 됩니다.

예:

```text
https://your-domain.vercel.app
https://your-domain.vercel.app/journal
```

매매일지는 현재 브라우저 `localStorage`에 저장됩니다. 로그인 없이 바로 쓰는 1차 버전이며, 기기 간 동기화가 필요하면 Supabase Auth + `trade_journals` 테이블로 확장하면 됩니다.
