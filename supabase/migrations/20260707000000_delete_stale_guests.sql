-- 7일 지난 게스트(익명) 계정 데이터 자동 삭제
-- 익명 사용자는 실제 auth.users 행이지만 임시 계정이므로 주기적으로 정리한다.
-- cards는 user_id FK에 on delete cascade가 걸려 있어 auth.users 삭제 시 함께 삭제됨.
-- Storage 이미지는 FK가 없어 명시적으로 삭제한다.

create extension if not exists pg_cron;

create or replace function public.delete_stale_guest_accounts()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1) 7일 지난 익명 계정의 Storage 이미지 삭제 (card-images/{uid}/...)
  delete from storage.objects
   where bucket_id = 'card-images'
     and (storage.foldername(name))[1] in (
       select id::text
         from auth.users
        where is_anonymous = true
          and created_at < now() - interval '7 days'
     );

  -- 2) 7일 지난 익명 계정 삭제 → cards는 on delete cascade로 함께 삭제
  delete from auth.users
   where is_anonymous = true
     and created_at < now() - interval '7 days';
end;
$$;

-- 매일 03:00 UTC 실행 (재적용 대비 기존 잡 제거 후 등록)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'delete-stale-guests') then
    perform cron.unschedule('delete-stale-guests');
  end if;
end $$;

select cron.schedule(
  'delete-stale-guests',
  '0 3 * * *',
  $$select public.delete_stale_guest_accounts()$$
);