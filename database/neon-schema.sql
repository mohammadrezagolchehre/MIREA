create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  first_name text not null,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists chat_sessions_user_updated_idx
  on chat_sessions (user_id, updated_at desc);

create index if not exists messages_session_created_idx
  on messages (session_id, created_at asc);

create index if not exists otp_codes_phone_code_idx
  on otp_codes (phone, code, used, expires_at);
