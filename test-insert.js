const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbygqggraaaixjjenfkp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJieWdxZ2dyYWFhaXhqamVuZmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODQxMTEsImV4cCI6MjA5MjY2MDExMX0.COfxMcH_EgU3fd9YxHKhP9EpmmwmiK1rexAyYeDMNFg';

const db = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testando inserção em pedidos...');
  const { data: order, error: orderError } = await db.from('pedidos').insert({
    nome_cliente: 'Teste Backend',
    telefone_cliente: '11999999999',
    total: 100.50,
    status: 'pendente',
  }).select('id').single();

  if (orderError) {
    console.error('ERRO AO CRIAR PEDIDO:', orderError);
    return;
  }
  console.log('Pedido criado:', order);

  console.log('Testando inserção em itens_pedido...');
  const { error: itemsError } = await db.from('itens_pedido').insert([
    {
      pedido_id: order.id,
      produto_id: 1,
      nome_produto: 'Produto Teste',
      preco_unitario: 100.50,
      quantidade: 1
    }
  ]);

  if (itemsError) {
    console.error('ERRO AO SALVAR ITENS:', itemsError);
    return;
  }
  console.log('Item criado com sucesso!');
}

testInsert();
