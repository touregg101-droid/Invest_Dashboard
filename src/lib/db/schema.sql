create table if not exists stocks (
  id uuid primary key default gen_random_uuid(),
  ticker text not null unique,
  name text not null,
  type text not null,
  market text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists stocks_ticker_key on stocks(ticker);

create table if not exists price_daily (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume numeric,
  change_rate numeric,
  source text,
  fetched_at timestamptz
);

create unique index if not exists price_daily_stock_date_key on price_daily(stock_id, date);

create table if not exists investor_flow_daily (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  date date not null,
  individual_net_buy numeric,
  institution_net_buy numeric,
  foreign_net_buy numeric,
  source text,
  fetched_at timestamptz
);

create unique index if not exists investor_flow_daily_stock_date_key on investor_flow_daily(stock_id, date);

create table if not exists sentiment_daily (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  date date not null,
  positive_ratio numeric,
  neutral_ratio numeric,
  negative_ratio numeric,
  top_keywords jsonb,
  summary text,
  source text,
  fetched_at timestamptz
);

create unique index if not exists sentiment_daily_stock_date_key on sentiment_daily(stock_id, date);

create table if not exists fear_greed_index (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  score numeric,
  label text,
  components_json jsonb,
  summary text,
  fetched_at timestamptz
);

create unique index if not exists fear_greed_index_date_key on fear_greed_index(date);

create table if not exists fundamentals (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  period text not null,
  revenue numeric,
  operating_income numeric,
  net_income numeric,
  operating_margin numeric,
  roe numeric,
  debt_ratio numeric,
  per numeric,
  pbr numeric,
  eps numeric,
  bps numeric,
  source text,
  fetched_at timestamptz
);

create unique index if not exists fundamentals_stock_period_key on fundamentals(stock_id, period);

create table if not exists etf_holdings (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  holding_name text,
  holding_ticker text,
  weight numeric,
  date date,
  source text,
  fetched_at timestamptz
);

create unique index if not exists etf_holdings_stock_holding_date_key on etf_holdings(stock_id, holding_ticker, date);

create table if not exists research_reports (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id),
  title text,
  broker text,
  published_date date,
  target_price numeric,
  rating text,
  summary text,
  positive_points jsonb,
  risk_points jsonb,
  source_url text,
  fetched_at timestamptz
);

create unique index if not exists research_reports_source_url_key on research_reports(source_url);

create table if not exists collection_logs (
  id uuid primary key default gen_random_uuid(),
  job_name text,
  status text,
  message text,
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists trade_journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  stock_id uuid references stocks(id),
  action_type text not null check (action_type in ('hold', 'buy', 'sell')),
  decision_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  decision_reason text not null,
  buy_price numeric,
  sell_price numeric,
  quantity numeric,
  target_price numeric,
  stop_loss_price numeric,
  investment_horizon text check (investment_horizon in ('short', 'medium', 'long')),
  evidence_tags jsonb,
  emotion_state text,
  review_status text not null default 'not_reviewed' check (review_status in ('not_reviewed', 'reviewed')),
  review_result text check (review_result in ('as_expected', 'different', 'pending')),
  review_memo text,
  lessons_learned text,
  improvement_next_time text,
  result_price numeric,
  result_return_rate numeric,
  holding_period_days integer,
  decision_score integer check (decision_score between 1 and 5),
  snapshot_json jsonb
);
