create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  first_name text not null,
  last_name text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users
  add column if not exists birth_date date;

create table if not exists chat_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  preview text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key,
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  status text not null default 'completed' check (status in ('streaming', 'completed', 'error')),
  created_at timestamptz not null default now()
);

create table if not exists otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

alter table otp_codes
  add column if not exists attempts integer not null default 0;

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists registration_tickets (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists rate_limits (
  key text primary key,
  count integer not null default 1,
  expires_at timestamptz not null
);

create index if not exists chat_sessions_user_updated_idx
  on chat_sessions (user_id, updated_at desc);

create index if not exists messages_session_created_idx
  on messages (session_id, created_at asc);

create index if not exists otp_codes_phone_code_idx
  on otp_codes (phone, code, used, expires_at);

create index if not exists auth_sessions_user_expires_idx
  on auth_sessions (user_id, expires_at desc);

create index if not exists registration_tickets_phone_expires_idx
  on registration_tickets (phone, expires_at desc);

create index if not exists rate_limits_expires_idx
  on rate_limits (expires_at);
