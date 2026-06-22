-- 카드 이미지 버킷을 공개로 변경 (카드 공유 기능 대비, 펫 사진은 민감하지 않음)
UPDATE storage.buckets SET public = true WHERE id = 'card-images';

-- 누구나 읽기 가능 (공유용)
CREATE POLICY "public read card images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'card-images');