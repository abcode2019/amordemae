const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbygqggraaaixjjenfkp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJieWdxZ2dyYWFhaXhqamVuZmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODQxMTEsImV4cCI6MjA5MjY2MDExMX0.COfxMcH_EgU3fd9YxHKhP9EpmmwmiK1rexAyYeDMNFg';

const db = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await db.from('produtos').select('id, nome, imagens').order('id', { ascending: false }).limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products:', JSON.stringify(data, null, 2));
  }
}

checkProducts();
