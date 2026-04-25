// Product Detail Page
const ProductDetail = ({ product, favorites, toggleFavorite, addToCart, setPage, showToast }) => {
  const [selectedSize, setSelectedSize] = React.useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = React.useState(product.colors?.[0] || '');
  const [activeImage, setActiveImage] = React.useState(0);

  const getSizePrice = (sizeName) => {
    const sp = (product.sizePrices || []).find(s => s.size === sizeName);
    return sp ? { price: sp.price, originalPrice: sp.originalPrice } : { price: product.price, originalPrice: product.originalPrice };
  };
  const [sizePrice, setSizePrice] = React.useState(getSizePrice(product.sizes?.[0]));

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizePrice(getSizePrice(size));
  };
  const [qty, setQty] = React.useState(1);
  const isFav = favorites.includes(product.id);

  // WhatsApp popup state
  const [showWhatsAppModal, setShowWhatsAppModal] = React.useState(false);
  const [wpName, setWpName] = React.useState('');
  const [wpPhone, setWpPhone] = React.useState('');

  const unitPrice = sizePrice.price;
  const totalPrice = unitPrice * qty;

  const handleWhatsAppSend = () => {
    if (!wpName.trim()) return;
    const msg = encodeURIComponent(
      `Olá! Meu nome é *${wpName.trim()}*${wpPhone.trim() ? `\nTelefone: ${wpPhone.trim()}` : ''}\n\nTenho interesse no produto:\n\n*${product.name}*${selectedSize ? `\nTamanho: ${selectedSize}` : ''}${selectedColor ? `\nCor: ${selectedColor}` : ''}\nQuantidade: ${qty}\nPreço unitário: R$ ${unitPrice.toFixed(2).replace(".", ",")}\n*Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*\n\nPode me ajudar a finalizar?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setShowWhatsAppModal(false);
    setWpName('');
    setWpPhone('');
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, price: unitPrice }, { size: selectedSize, color: selectedColor });
    }
  };

  const btnBase = {
    padding: "15px 24px", borderRadius: 14, fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "Nunito, sans-serif", transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  };

  const modalOverlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: 24,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68 }}>

      {/* WhatsApp Modal — Nome e Telefone */}
      {showWhatsAppModal && (
        <div style={modalOverlay} onClick={() => setShowWhatsAppModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 24, padding: 32, maxWidth: 420, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease",
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, color: "#3D2B2B", margin: "0 0 6px" }}>
                Comprar via WhatsApp
              </h2>
              <p style={{ color: "#9B7B7B", fontSize: 13, margin: 0 }}>
                Preencha seus dados para enviarmos a mensagem
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 6 }}>
                Seu Nome *
              </label>
              <input
                value={wpName}
                onChange={e => setWpName(e.target.value)}
                placeholder="Digite seu nome"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
                  border: "2px solid #f0e8e8", outline: "none", fontFamily: "Nunito, sans-serif",
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = '#D29B9B'}
                onBlur={e => e.target.style.borderColor = '#f0e8e8'}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 6 }}>
                Telefone <span style={{ fontWeight: 400, color: "#9B7B7B" }}>(opcional)</span>
              </label>
              <input
                value={wpPhone}
                onChange={e => setWpPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
                  border: "2px solid #f0e8e8", outline: "none", fontFamily: "Nunito, sans-serif",
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = '#D29B9B'}
                onBlur={e => e.target.style.borderColor = '#f0e8e8'}
              />
            </div>

            {/* Resumo do pedido */}
            <div style={{
              background: "#fdf9f9", borderRadius: 14, padding: 16, marginBottom: 20,
              border: "1px solid #f0e8e8", fontSize: 13, color: "#7A5A5A",
            }}>
              <div style={{ fontWeight: 700, color: "#3D2B2B", marginBottom: 8 }}>{product.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{qty}× R$ {unitPrice.toFixed(2).replace(".", ",")}</span>
                <span style={{ fontWeight: 700, color: "#C2877E" }}>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              {selectedSize && <div>Tamanho: {selectedSize}</div>}
              {selectedColor && <div>Cor: {selectedColor}</div>}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                style={{
                  flex: 1, padding: "13px", borderRadius: 12, border: "2px solid #f0e8e8",
                  background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Nunito, sans-serif",
                }}
              >Cancelar</button>
              <button
                onClick={handleWhatsAppSend}
                disabled={!wpName.trim()}
                style={{
                  flex: 2, padding: "13px", borderRadius: 12, border: "none",
                  background: wpName.trim() ? "#25D366" : "#ccc",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: wpName.trim() ? "pointer" : "not-allowed",
                  fontFamily: "Nunito, sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: wpName.trim() ? "0 6px 16px rgba(37,211,102,0.3)" : "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.285a.75.75 0 0 0 .916.916l5.435-1.471A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.979-1.37l-.357-.213-3.704 1.003 1.003-3.704-.213-.357A9.725 9.725 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                Enviar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9B7B7B" }}>
          <button onClick={() => setPage("landing")} style={{ background: "none", border: "none", cursor: "pointer", color: "#B89090", fontFamily: "Nunito, sans-serif", fontSize: 13 }}>Início</button>
          <span>›</span>
          <button onClick={() => setPage("catalog")} style={{ background: "none", border: "none", cursor: "pointer", color: "#B89090", fontFamily: "Nunito, sans-serif", fontSize: 13 }}>Catálogo</button>
          <span>›</span>
          <span style={{ color: "#D29B9B", fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="product-detail-grid">
          {/* Gallery */}
          <div>
            <div style={{
              borderRadius: 24, overflow: "hidden", aspectRatio: "1",
              boxShadow: "0 12px 48px rgba(210,155,155,0.15)",
              marginBottom: 16,
            }}>
              <ProductImage productId={product.id} src={product.images?.[activeImage]} index={activeImage} size="full" />
            </div>
            {/* Thumbnails — só mostra se houver 2+ imagens */}
            {(product.images?.length > 1) && (
              <div style={{ display: "flex", gap: 12 }}>
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{
                    width: 80, height: 80, borderRadius: 14, overflow: "hidden",
                    border: activeImage === i ? "3px solid #D29B9B" : "3px solid transparent",
                    cursor: "pointer", padding: 0, background: "none", flexShrink: 0,
                    boxShadow: activeImage === i ? "0 4px 12px rgba(210,155,155,0.3)" : "none",
                    transition: "all 0.2s",
                  }}>
                    <ProductImage productId={product.id} src={product.images?.[i]} index={i} size="thumb" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                {product.badge && (
                  <div style={{
                    display: "inline-block", background: "linear-gradient(135deg, #D29B9B, #C2877E)",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 8, marginBottom: 12,
                  }}>{product.badge}</div>
                )}
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 32, color: "#3D2B2B", margin: 0, lineHeight: 1.2 }}>
                  {product.name}
                </h1>
              </div>
              <button onClick={() => toggleFavorite(product.id)} style={{
                background: isFav ? "#fdf0f0" : "#fff",
                border: "2px solid " + (isFav ? "#D29B9B" : "#f0e8e8"),
                width: 48, height: 48, borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24"
                  fill={isFav ? "#D29B9B" : "none"} stroke="#D29B9B" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(product.rating) ? "#C2877E" : "#e0d0d0", fontSize: 16 }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: "#B89090" }}>({product.reviews} avaliações)</span>
            </div>

            {/* Price — mostra preço total baseado na quantidade */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
              {sizePrice.originalPrice && (
                <span style={{ fontSize: 18, color: "#B89090", textDecoration: "line-through" }}>
                  R$ {(sizePrice.originalPrice * qty).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
            {qty > 1 && (
              <div style={{ fontSize: 13, color: "#9B7B7B", marginBottom: 20 }}>
                {qty}× R$ {unitPrice.toFixed(2).replace(".", ",")} cada
              </div>
            )}
            {qty === 1 && <div style={{ marginBottom: 20 }} />}

            <p style={{ fontSize: 16, color: "#7A5A5A", lineHeight: 1.8, margin: "0 0 28px" }}>
              {product.description}
            </p>

            {/* Size */}
            {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 10 }}>
                Tamanho: <span style={{ color: "#D29B9B" }}>{selectedSize}</span>
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => handleSizeSelect(s)} style={{
                    padding: "10px 18px", borderRadius: 12, fontSize: 13, cursor: "pointer",
                    border: selectedSize === s ? "2px solid #D29B9B" : "2px solid #f0e8e8",
                    background: selectedSize === s ? "#fdf0f0" : "#fff",
                    color: "#3D2B2B", fontFamily: "Nunito, sans-serif", fontWeight: 600,
                    transition: "all 0.2s",
                  }}>{s}</button>
                ))}
              </div>
            </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 10 }}>
                Cor: <span style={{ color: "#759B96" }}>{selectedColor}</span>
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} style={{
                    padding: "10px 18px", borderRadius: 12, fontSize: 13, cursor: "pointer",
                    border: selectedColor === c ? "2px solid #759B96" : "2px solid #f0e8e8",
                    background: selectedColor === c ? "#f0f5f4" : "#fff",
                    color: "#3D2B2B", fontFamily: "Nunito, sans-serif", fontWeight: 600,
                    transition: "all 0.2s",
                  }}>{c}</button>
                ))}
              </div>
            </div>
            )}

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>Quantidade:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "2px solid #f0e8e8", borderRadius: 12, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                  width: 40, height: 40, background: "#fff", border: "none",
                  cursor: "pointer", fontSize: 18, color: "#D29B9B", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>−</button>
                <span style={{ minWidth: 40, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#3D2B2B" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{
                  width: 40, height: 40, background: "#fff", border: "none",
                  cursor: "pointer", fontSize: 18, color: "#D29B9B", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>+</button>
              </div>
            </div>

            {/* CTA buttons — sem personalização, direto ao carrinho */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={handleAddToCart} style={{
                ...btnBase,
                background: "linear-gradient(135deg, #D29B9B, #C2877E)",
                border: "none", color: "#fff",
                boxShadow: "0 8px 24px rgba(194,135,126,0.4)",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Adicionar ao Carrinho
              </button>
              <button onClick={() => setShowWhatsAppModal(true)} style={{
                ...btnBase,
                background: "#25D366", border: "none", color: "#fff",
                boxShadow: "0 8px 24px rgba(37,211,102,0.3)",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.85L.057 23.285a.75.75 0 0 0 .916.916l5.435-1.471A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.979-1.37l-.357-.213-3.704 1.003 1.003-3.704-.213-.357A9.725 9.725 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                Comprar via WhatsApp
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              {[["🔒", "Pagamento seguro"], ["🚫", "Não realizamos entrega"], ["📦", "Embalagem especial"], ["💌", "Feito com amor"]].map(([ic, lb]) => (
                <div key={lb} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9B7B7B" }}>
                  <span>{ic}</span><span>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

Object.assign(window, { ProductDetail });
