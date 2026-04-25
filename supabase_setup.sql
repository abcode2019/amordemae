-- =============================================================
-- Amor de Mãe 3D — Supabase Setup (Complemento)
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================================

-- ===================== REMOVER TABELAS EM INGLÊS (duplicadas) =====================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ===================== POLÍTICAS ADMIN (recriar sem conflito) =====================

-- Remover políticas anteriores (caso já existam)
DROP POLICY IF EXISTS "produtos_insercao_admin" ON produtos;
DROP POLICY IF EXISTS "produtos_atualizacao_admin" ON produtos;
DROP POLICY IF EXISTS "produtos_exclusao_admin" ON produtos;
DROP POLICY IF EXISTS "pedidos_leitura_admin" ON pedidos;
DROP POLICY IF EXISTS "pedidos_atualizacao_admin" ON pedidos;
DROP POLICY IF EXISTS "itens_pedido_leitura_admin" ON itens_pedido;
DROP POLICY IF EXISTS "depoimentos_leitura_admin" ON depoimentos;
DROP POLICY IF EXISTS "depoimentos_atualizacao_admin" ON depoimentos;

-- Recriar políticas admin
CREATE POLICY "produtos_insercao_admin"
  ON produtos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "produtos_atualizacao_admin"
  ON produtos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "produtos_exclusao_admin"
  ON produtos FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "pedidos_leitura_admin"
  ON pedidos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "pedidos_atualizacao_admin"
  ON pedidos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "itens_pedido_leitura_admin"
  ON itens_pedido FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "depoimentos_leitura_admin"
  ON depoimentos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "depoimentos_atualizacao_admin"
  ON depoimentos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===================== AJUSTE COLUNA IMAGENS =====================
-- Muda de int[] para text[] para armazenar URLs
ALTER TABLE produtos ALTER COLUMN imagens TYPE text[] USING '{}';
ALTER TABLE produtos ALTER COLUMN imagens SET DEFAULT '{}';

-- ===================== SUPABASE STORAGE — BUCKET DE IMAGENS =====================

INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas de storage anteriores (caso existam)
DROP POLICY IF EXISTS "imagens_leitura_publica" ON storage.objects;
DROP POLICY IF EXISTS "imagens_upload_admin" ON storage.objects;
DROP POLICY IF EXISTS "imagens_atualizacao_admin" ON storage.objects;
DROP POLICY IF EXISTS "imagens_exclusao_admin" ON storage.objects;

CREATE POLICY "imagens_leitura_publica"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'produtos');

CREATE POLICY "imagens_upload_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produtos');

CREATE POLICY "imagens_atualizacao_admin"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produtos');

CREATE POLICY "imagens_exclusao_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'produtos');
