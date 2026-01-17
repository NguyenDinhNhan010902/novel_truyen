-- 1. Cho phép Upload (Insert) vào bucket 'images' cho tất cả mọi người (hoặc role anon)
create policy "Allow Public Uploads"
on storage.objects for insert
to public
with check ( bucket_id = 'images' );

-- 2. Cho phép Xem (Select) thì bucket Public đã tự xử lý rồi, nhưng thêm cho chắc
create policy "Allow Public Select"
on storage.objects for select
to public
using ( bucket_id = 'images' );

-- 3. Cho phép Xóa/Sửa (nếu cần sau này)
create policy "Allow Public Update"
on storage.objects for update
to public
using ( bucket_id = 'images' );

create policy "Allow Public Delete"
on storage.objects for delete
to public
using ( bucket_id = 'images' );
