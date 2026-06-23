-- 계정 삭제 시 스토리지 이미지도 함께 삭제 (5.1.1(v) 완전 삭제 보강)
-- 기존 delete_account는 cards + auth.users만 지워 스토리지 고아 파일이 남았음.
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  -- 1. 유저 스토리지 이미지 삭제 (card-images/{uid}/...)
  delete from storage.objects
   where bucket_id = 'card-images'
     and (storage.foldername(name))[1] = uid::text;

  -- 2. 카드 삭제
  delete from public.cards where user_id = uid;

  -- 3. 계정 삭제
  delete from auth.users where id = uid;
end;
$$;

grant execute on function public.delete_account() to authenticated;