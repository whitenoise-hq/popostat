-- cards 테이블 생성
create table public.cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  pet_name     text not null,
  image_url    text not null,
  detected     text not null,
  name_guess   text,
  power        integer not null,
  grade        text not null,
  title        text,
  analysis     text,
  special_move text,
  stats        jsonb not null
);

-- 인덱스
create index cards_user_id_idx on public.cards(user_id);
create index cards_grade_idx on public.cards(grade);
create index cards_created_at_idx on public.cards(created_at desc);

-- RLS 활성화
alter table public.cards enable row level security;

-- 소유자만 접근
create policy "select own cards"
  on public.cards for select
  using (auth.uid() = user_id);

create policy "insert own cards"
  on public.cards for insert
  with check (auth.uid() = user_id);

create policy "update own cards"
  on public.cards for update
  using (auth.uid() = user_id);

create policy "delete own cards"
  on public.cards for delete
  using (auth.uid() = user_id);

-- Storage 버킷 생성
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', false);

-- Storage 정책: 소유자만 업로드/조회
create policy "upload own images"
  on storage.objects for insert
  with check (
    bucket_id = 'card-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "read own images"
  on storage.objects for select
  using (
    bucket_id = 'card-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 계정 삭제 RPC (5.1.1(v) 대응)
create or replace function public.delete_account()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.cards where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_account() to authenticated;