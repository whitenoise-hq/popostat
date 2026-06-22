-- Data API 역할에 cards 테이블 접근 권한 부여
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO anon, authenticated, service_role;