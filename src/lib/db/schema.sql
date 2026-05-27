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
  category text,
  criteria_json jsonb,
  title text,
  broker text,
  published_date date,
  target_price numeric,
  rating text,
  summary text,
  positive_points jsonb,
  risk_points jsonb,
  outlook text,
  target_change text,
  source_url text,
  source text,
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

create table if not exists market_indicators_daily (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  name text not null,
  reason text not null,
  date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  previous_close numeric,
  change numeric,
  change_rate numeric,
  volume numeric,
  source text,
  fetched_at timestamptz
);

create unique index if not exists market_indicators_daily_ticker_date_key on market_indicators_daily(ticker, date);
