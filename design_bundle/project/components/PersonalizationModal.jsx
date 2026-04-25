// Personalization Modal
const PersonalizationModal = ({ product, onClose, onConfirm }) => {
  const [form, setForm] = React.useState({ name: "", date: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]);

  const validate = () => {
    const e = {};
    if (product.personalizationFields.includes("name") && !form.name.trim()) e.name = "Por favor, informe o nome";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onConfirm({ ...form, size: selectedSize, color: selectedColor });
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const fieldStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
    border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
    outline: "none", transition: "border 0.2s", background: "#fdf9f9",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(61,43,43,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, backdropFilter: "blur(4px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 32, maxWidth: 480,
        width: "100%", boxShadow: "0 24px 64px rgba(61,43,43,0.2)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: "#3D2B2B", fontFamily: "Playfair Display, serif" }}>
              Personalize com amor 💖
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9B7B7B" }}>{product.name}</p>
          </div>
          <button onClick={onClose} style={{
            background: "#fdf5f5", border: "none", width: 36, height: 36,
            borderRadius: "50%", cursor: "pointer", fontSize: 18, color: "#9B7B7B",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Size */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>Tamanho</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{
                  padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                  border: selectedSize === s ? "2px solid #D29B9B" : "2px solid #f0e8e8",
                  background: selectedSize === s ? "#fdf0f0" : "#fff",
                  color: selectedColor === s ? "#D29B9B" : "#3D2B2B",
                  fontFamily: "Nunito, sans-serif", fontWeight: 600, transition: "all 0.2s",
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>Cor</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.colors.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{
                  padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                  border: selectedColor === c ? "2px solid #759B96" : "2px solid #f0e8e8",
                  background: selectedColor === c ? "#f0f5f4" : "#fff",
                  color: "#3D2B2B", fontFamily: "Nunito, sans-serif", fontWeight: 600,
                  transition: "all 0.2s",
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Name field */}
          {product.personalizationFields.includes("name") && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>
                Nome / Texto principal *
              </label>
              <input
                style={{ ...fieldStyle, borderColor: errors.name ? "#C2877E" : form.name ? "#D29B9B" : "#f0e8e8" }}
                placeholder="Ex: Maria, Família Silva, Mãe…"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
              />
              {errors.name && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 4, display: "block" }}>{errors.name}</span>}
            </div>
          )}

          {/* Date field */}
          {product.personalizationFields.includes("date") && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>
                Data especial (opcional)
              </label>
              <input
                type="text"
                style={fieldStyle}
                placeholder="Ex: 10/05/1985, Dia das Mães 2025…"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
          )}

          {/* Message field */}
          {product.personalizationFields.includes("message") && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>
                Observações / Mensagem (opcional)
              </label>
              <textarea
                style={{ ...fieldStyle, height: 80, resize: "none" }}
                placeholder="Algum detalhe especial? Cores, referências, algo que torne único…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "14px", borderRadius: 14, border: "2px solid #f0e8e8",
            background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
          }}>Cancelar</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "14px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 16px rgba(194,135,126,0.4)",
          }}>
            Adicionar ao Carrinho 🛒
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#B89090", textAlign: "center", marginTop: 12 }}>
          💬 Você também pode enviar mais detalhes pelo WhatsApp ao finalizar o pedido
        </p>
      </div>
    </div>
  );
};

Object.assign(window, { PersonalizationModal });
