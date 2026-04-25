// Cart Page
const Cart = ({ cart, updateQty, removeFromCart, setPage }) => {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const [custName, setCustName] = React.useState('');
  const [custPhone, setCustPhone] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const buildMsg = () => {
    const lines = cart.map(item => {
      const p = item.product;
      const pers = [];
      if (item.personalization.name) pers.push(`Nome: ${item.personalization.name}`);
      if (item.personalization.date) pers.push(`Data: ${item.personalization.date}`);
      if (item.personalization.message) pers.push(`Obs: ${item.personalization.message}`);
      if (item.personalization.size) pers.push(`Tamanho: ${item.personalization.size}`);
      if (item.personalization.color) pers.push(`Cor: ${item.personalization.color}`);
      return `• *${p.name}* (x${item.qty}) — R$ ${(p.price * item.qty).toFixed(2).replace(".", ",")}\n  ${pers.join(" | ")}`;
    }).join("\n\n");
    return encodeURIComponent(
      `Olá! Meu nome é ${custName}.\n\nQuero fazer um pedido:\n\n${lines}\n\n*Total: R$ ${total.toFixed(2).replace(".", ",")}*\n\nPode me ajudar a finalizar? 💖`
    );
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: order, error: orderError } = await db.from('pedidos').insert({
        nome_cliente: custName.trim(),
        telefone_cliente: custPhone.trim() || null,
        total,
        status: 'pendente',
      }).select('id').single();

      if (orderError) console.error('Erro ao criar pedido no Supabase:', orderError);

      if (order?.id) {
        const { error: itemsError } = await db.from('itens_pedido').insert(cart.map(item => ({
          pedido_id: order.id,
          produto_id: item.product.id,
          nome_produto: item.product.name,
          preco_unitario: item.product.price,
          quantidade: item.qty,
          tamanho: item.personalization.size || null,
          cor: item.personalization.color || null,
          personalizacao_nome: item.personalization.name || null,
          personalizacao_data: item.personalization.date || null,
          personalizacao_msg: item.personalization.message || null,
        })));
        if (itemsError) console.error('Erro ao salvar itens no Supabase:', itemsError);
      }
    } catch (err) {
      console.error('Exceção ao finalizar:', err);
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMsg()}`, '_blank');
    setSaving(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, color: "#3D2B2B", margin: "0 0 12px" }}>
            Seu carrinho está vazio
          </h2>
          <p style={{ color: "#9B7B7B", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
            Que tal escolher uma peça especial para eternizar uma memória?
          </p>
          <button onClick={() => setPage("catalog")} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "16px 36px",
            borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 8px 24px rgba(194,135,126,0.4)",
          }}>Ver catálogo 💖</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 8px" }}>
          Meu Carrinho
        </h1>
        <p style={{ color: "#9B7B7B", margin: "0 0 36px" }}>
          {totalItems} {totalItems === 1 ? "item" : "itens"} — cada um cheio de amor 💖
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }} className="cart-grid">
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.map((item, idx) => (
              <div key={item.id} style={{
                background: "#fff", borderRadius: 20, padding: 20,
                boxShadow: "0 4px 20px rgba(210,155,155,0.1)",
                border: "1px solid #f8f0f0",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                {/* Thumb */}
                <div style={{ width: 90, height: 90, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                  <ProductImage productId={item.product.id} src={item.product.images?.[0]} size="thumb" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "#3D2B2B", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
                      {item.product.name}
                    </h3>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#C2877E", fontSize: 18, padding: "0 0 0 8px", lineHeight: 1,
                    }}>×</button>
                  </div>

                  {/* Personalization tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {item.personalization.size && (
                      <span style={{ fontSize: 11, background: "#fdf0f0", color: "#C2877E", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        {item.personalization.size}
                      </span>
                    )}
                    {item.personalization.color && (
                      <span style={{ fontSize: 11, background: "#f0f5f4", color: "#759B96", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        {item.personalization.color}
                      </span>
                    )}
                    {item.personalization.name && (
                      <span style={{ fontSize: 11, background: "#f8f5f0", color: "#8B6B4A", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        ✏️ {item.personalization.name}
                      </span>
                    )}
                    {item.personalization.date && (
                      <span style={{ fontSize: 11, background: "#f8f5f0", color: "#8B6B4A", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                        📅 {item.personalization.date}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Qty */}
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #f0e8e8", borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{
                        width: 34, height: 34, background: "#fff", border: "none",
                        cursor: "pointer", fontSize: 16, color: "#D29B9B", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>−</button>
                      <span style={{ minWidth: 32, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{
                        width: 34, height: 34, background: "#fff", border: "none",
                        cursor: "pointer", fontSize: 16, color: "#D29B9B", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>+</button>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
                      R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 28,
            boxShadow: "0 4px 24px rgba(210,155,155,0.12)",
            border: "1px solid #f8f0f0", position: "sticky", top: 88,
          }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, color: "#3D2B2B", margin: "0 0 20px" }}>
              Resumo do pedido
            </h3>

            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: "#7A5A5A" }}>{item.product.name} ×{item.qty}</span>
                <span style={{ fontWeight: 700, color: "#3D2B2B" }}>
                  R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}

            <div style={{ borderTop: "2px dashed #f0e8e8", margin: "16px 0", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#3D2B2B" }}>Total</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <form onSubmit={handleFinalize} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#3D2B2B", fontFamily: "Nunito, sans-serif" }}>
                Para finalizar, informe:
              </p>
              <input
                required
                placeholder="Seu nome *"
                value={custName}
                onChange={e => setCustName(e.target.value)}
                style={{
                  padding: "12px 14px", borderRadius: 12, fontSize: 14,
                  border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                  outline: "none", background: "#fdf9f9", color: "#3D2B2B",
                }}
              />
              <input
                placeholder="Telefone / WhatsApp"
                value={custPhone}
                onChange={e => setCustPhone(e.target.value)}
                style={{
                  padding: "12px 14px", borderRadius: 12, fontSize: 14,
                  border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                  outline: "none", background: "#fdf9f9", color: "#3D2B2B",
                }}
              />
              <button type="submit" disabled={saving || !custName.trim()} style={{
                padding: "15px", borderRadius: 14, border: "none",
                background: saving || !custName.trim() ? "#e8dada" : "#25D366",
                color: saving || !custName.trim() ? "#B89090" : "#fff",
                fontSize: 15, fontWeight: 700,
                cursor: saving || !custName.trim() ? "not-allowed" : "pointer",
                fontFamily: "Nunito, sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                boxShadow: saving || !custName.trim() ? "none" : "0 8px 24px rgba(37,211,102,0.35)",
                transition: "all 0.2s",
              }}>
                {!saving && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.285a.75.75 0 0 0 .916.916l5.435-1.471A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.979-1.37l-.357-.213-3.704 1.003 1.003-3.704-.213-.357A9.725 9.725 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                )}
                {saving ? "Salvando pedido…" : "Finalizar no WhatsApp"}
              </button>
            </form>

            <button onClick={() => setPage("catalog")} style={{
              width: "100%", padding: "12px", borderRadius: 14,
              background: "none", border: "2px solid #f0e8e8",
              color: "#9B7B7B", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>← Continuar comprando</button>

            <div style={{ marginTop: 20, padding: 14, background: "#fdf8f5", borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: "#9B7B7B", margin: 0, textAlign: "center", lineHeight: 1.6 }}>
                💌 Ao finalizar, você será redirecionada para o WhatsApp onde nossa equipe cuidará do seu pedido com todo o carinho que ele merece.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Cart });
