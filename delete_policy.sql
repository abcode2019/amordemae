-- Permitir que usuários autenticados (Admin) deletem pedidos
CREATE POLICY "pedidos_exclusao_admin"
  ON pedidos FOR DELETE
  TO authenticated
  USING (true);

-- Permitir que usuários autenticados (Admin) deletem itens do pedido (necessário para o cascade)
CREATE POLICY "itens_pedido_exclusao_admin"
  ON itens_pedido FOR DELETE
  TO authenticated
  USING (true);
