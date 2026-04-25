-- Permitir que qualquer pessoa veja as imagens (público)
CREATE POLICY "Imagens publicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

-- Permitir que usuários autenticados (Admin) façam upload de imagens
CREATE POLICY "Upload de imagens admin"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produtos');

-- Permitir que usuários autenticados (Admin) deletem imagens
CREATE POLICY "Deletar imagens admin"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos');

-- Permitir que usuários autenticados (Admin) atualizem imagens
CREATE POLICY "Atualizar imagens admin"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produtos');
