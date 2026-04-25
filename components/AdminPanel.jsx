// Admin Panel — Product Management
const EMPTY_PRODUCT = {
  name: "", category: "decoracao",
  description: "", shortDescription: "",
  sizePrices: [{ size: "", price: "", originalPrice: "" }],
  colors: "", badge: "", tags: "",
  rating: "5.0", reviews: "0", featured: false, inStock: true,
  personalizationFields: ["name", "date", "message"],
};

const AdminPanel = ({ products, onAddProduct, onEditProduct, onDeleteProduct, onLogout, setPage }) => {
  const [view, setView] = React.useState("list"); // list | new | edit
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [form, setForm] = React.useState(EMPTY_PRODUCT);
  const [errors, setErrors] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const [saved, setSaved] = React.useState(false);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(EMPTY_PRODUCT);
    setErrors({});
    setSaved(false);
    setView("new");
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      shortDescription: product.shortDescription,
      sizePrices: product.sizePrices?.length > 0
        ? product.sizePrices.map(sp => ({
            size: sp.size,
            price: sp.price.toString(),
            originalPrice: sp.originalPrice?.toString() || "",
          }))
        : product.sizes.map(s => ({
            size: s,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || "",
          })),
      colors: product.colors.join(", "),
      badge: product.badge || "",
      tags: product.tags.join(", "),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      featured: product.featured,
      inStock: product.inStock,
      personalizationFields: product.personalizationFields,
    });
    setErrors({});
    setSaved(false);
    setView("edit");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.description.trim()) e.description = "Descrição obrigatória";
    if (!form.shortDescription.trim()) e.shortDescription = "Descrição curta obrigatória";
    const valid = form.sizePrices.filter(sp => sp.size.trim() && sp.price);
    if (valid.length === 0) e.sizePrices = "Adicione ao menos um tamanho com preço";
    if (!form.colors.trim()) e.colors = "Ao menos uma cor";
    return e;
  };

  const buildProduct = (baseId) => {
    const validSP = form.sizePrices
      .filter(sp => sp.size.trim() && sp.price)
      .map(sp => ({
        size: sp.size.trim(),
        price: parseFloat(sp.price),
        originalPrice: sp.originalPrice ? parseFloat(sp.originalPrice) : null,
      }));
    const prices = validSP.map(sp => sp.price);
    const origPrices = validSP.filter(sp => sp.originalPrice).map(sp => sp.originalPrice);
    return {
      id: baseId,
      name: form.name.trim(),
      price: prices.length > 0 ? Math.min(...prices) : 0,
      originalPrice: origPrices.length > 0 ? Math.min(...origPrices) : null,
      category: form.category,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      sizes: validSP.map(sp => sp.size),
      sizePrices: validSP,
      colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
      badge: form.badge.trim() || null,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      rating: parseFloat(form.rating) || 5.0,
      reviews: parseInt(form.reviews) || 0,
      featured: form.featured,
      inStock: form.inStock,
      personalizationFields: form.personalizationFields,
      images: [1, 2, 3],
    };
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (view === "new") {
      const id = Date.now();
      onAddProduct(buildProduct(id));
    } else {
      onEditProduct(buildProduct(editingProduct.id));
    }
    setSaved(true);
    setTimeout(() => { setView("list"); setSaved(false); }, 1200);
  };

  const handleDelete = (id) => {
    onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  const addSizePrice = () => setForm(f => ({
    ...f, sizePrices: [...f.sizePrices, { size: "", price: "", originalPrice: "" }],
  }));

  const removeSizePrice = (idx) => setForm(f => ({
    ...f, sizePrices: f.sizePrices.filter((_, i) => i !== idx),
  }));

  const updateSizePrice = (idx, field, value) => {
    setForm(f => ({
      ...f,
      sizePrices: f.sizePrices.map((sp, i) => i === idx ? { ...sp, [field]: value } : sp),
    }));
    setErrors(er => ({ ...er, sizePrices: "" }));
  };

  const togglePersonField = (field) => {
    setForm(f => ({
      ...f,
      personalizationFields: f.personalizationFields.includes(field)
        ? f.personalizationFields.filter(x => x !== field)
        : [...f.personalizationFields, field],
    }));
  };

  // --- Styles ---
  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
    border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
    outline: "none", background: "#fdf9f9", color: "#3D2B2B",
    boxSizing: "border-box", transition: "border 0.2s",
  };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 6 };
  const fieldWrap = (hasErr) => ({ marginBottom: 20, ...(hasErr ? { animation: "shake 0.3s ease" } : {}) });

  const sectionTitle = (title, sub) => (
    <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #f0e8e8" }}>
      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#3D2B2B", margin: 0 }}>{title}</h3>
      {sub && <p style={{ fontSize: 13, color: "#9B7B7B", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );

  const categoryOptions = [
    { value: "decoracao", label: "Decoração" },
    { value: "luminaria", label: "Luminárias" },
    { value: "miniatura", label: "Miniaturas" },
    { value: "utilidade", label: "Utilidades" },
  ];

  // --- FORM VIEW ---
  if (view === "new" || view === "edit") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f0f0", padding: "0 0 60px" }}>
        {/* Admin Topbar */}
        <AdminTopbar onLogout={onLogout} setPage={setPage} />

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <button onClick={() => setView("list")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "#9B7B7B", fontFamily: "Nunito, sans-serif",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
              }}>← Voltar para lista</button>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#3D2B2B", margin: 0 }}>
                {view === "new" ? "Cadastrar Novo Produto" : `Editar: ${editingProduct?.name}`}
              </h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setView("list")} style={{
                padding: "11px 22px", borderRadius: 12, border: "2px solid #f0e8e8",
                background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
              }}>Cancelar</button>
              <button onClick={handleSave} style={{
                padding: "11px 28px", borderRadius: 12, border: "none",
                background: saved ? "#759B96" : "linear-gradient(135deg, #D29B9B, #C2877E)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
                boxShadow: "0 4px 16px rgba(194,135,126,0.35)",
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.3s",
              }}>
                {saved ? "✅ Salvo!" : (view === "new" ? "✨ Publicar Produto" : "💾 Salvar Alterações")}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }} className="admin-form-grid">
            {/* Main fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {/* Basic info */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Informações Básicas")}
                <div style={fieldWrap(errors.name)}>
                  <label style={labelStyle}>Nome do Produto *</label>
                  <input style={{ ...inputStyle, borderColor: errors.name ? "#C2877E" : "#f0e8e8" }}
                    placeholder="Ex: Porta-Retrato Família 3D"
                    value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }} />
                  {errors.name && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 4, display: "block" }}>{errors.name}</span>}
                </div>

                <div style={fieldWrap(errors.shortDescription)}>
                  <label style={labelStyle}>Descrição Curta * <span style={{ fontWeight: 400, color: "#9B7B7B" }}>(aparece no card)</span></label>
                  <input style={{ ...inputStyle, borderColor: errors.shortDescription ? "#C2877E" : "#f0e8e8" }}
                    placeholder="Ex: Eternize sua família em uma peça única"
                    value={form.shortDescription} onChange={e => { setForm(f => ({ ...f, shortDescription: e.target.value })); setErrors(er => ({ ...er, shortDescription: "" })); }} />
                  {errors.shortDescription && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 4, display: "block" }}>{errors.shortDescription}</span>}
                </div>

                <div style={fieldWrap(errors.description)}>
                  <label style={labelStyle}>Descrição Emocional * <span style={{ fontWeight: 400, color: "#9B7B7B" }}>(aparece na página do produto)</span></label>
                  <textarea style={{ ...inputStyle, height: 110, resize: "vertical", borderColor: errors.description ? "#C2877E" : "#f0e8e8" }}
                    placeholder="Uma descrição que toca o coração de quem lê…"
                    value={form.description} onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: "" })); }} />
                  {errors.description && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 4, display: "block" }}>{errors.description}</span>}
                </div>
              </div>

              {/* Tamanhos e Preços */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Tamanhos e Preços", "Defina o preço para cada tamanho disponível")}
                <div style={{ display: "grid", gridTemplateColumns: "12px 2fr 1fr 1fr 36px", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span />
                  <span style={{ ...labelStyle, marginBottom: 0 }}>Tamanho *</span>
                  <span style={{ ...labelStyle, marginBottom: 0 }}>Preço (R$) *</span>
                  <span style={{ ...labelStyle, marginBottom: 0 }}>Preço original (R$)</span>
                  <span />
                </div>
                {form.sizePrices.map((sp, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "12px 2fr 1fr 1fr 36px", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: "#B89090", fontWeight: 700 }}>{idx + 1}</span>
                    <input
                      style={{ ...inputStyle }}
                      placeholder="Ex: Pequeno (10x15)"
                      value={sp.size}
                      onChange={e => updateSizePrice(idx, "size", e.target.value)}
                    />
                    <input
                      style={{ ...inputStyle }}
                      type="number" step="0.01" min="0"
                      placeholder="89.90"
                      value={sp.price}
                      onChange={e => updateSizePrice(idx, "price", e.target.value)}
                    />
                    <input
                      style={{ ...inputStyle }}
                      type="number" step="0.01" min="0"
                      placeholder="119.90"
                      value={sp.originalPrice}
                      onChange={e => updateSizePrice(idx, "originalPrice", e.target.value)}
                    />
                    <button
                      onClick={() => removeSizePrice(idx)}
                      disabled={form.sizePrices.length === 1}
                      style={{
                        width: 36, height: 38, borderRadius: 10,
                        border: "2px solid #f0e8e8", background: "#fff",
                        color: "#C2877E", cursor: form.sizePrices.length === 1 ? "not-allowed" : "pointer",
                        fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: form.sizePrices.length === 1 ? 0.35 : 1, flexShrink: 0,
                      }}
                    >×</button>
                  </div>
                ))}
                <button onClick={addSizePrice} style={{
                  marginTop: 4, padding: "9px 16px", borderRadius: 12,
                  border: "2px dashed #f0e8e8", background: "none",
                  color: "#D29B9B", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Nunito, sans-serif",
                }}>+ Adicionar tamanho</button>
                {errors.sizePrices && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 8, display: "block" }}>{errors.sizePrices}</span>}
              </div>

              {/* Cores */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Variações", "Separe as opções por vírgula")}
                <div style={fieldWrap(errors.colors)}>
                  <label style={labelStyle}>Cores *</label>
                  <input style={{ ...inputStyle, borderColor: errors.colors ? "#C2877E" : "#f0e8e8" }}
                    placeholder="Ex: Branco Pérola, Rosa Queimado, Natural"
                    value={form.colors} onChange={e => { setForm(f => ({ ...f, colors: e.target.value })); setErrors(er => ({ ...er, colors: "" })); }} />
                  {errors.colors && <span style={{ fontSize: 12, color: "#C2877E", marginTop: 4, display: "block" }}>{errors.colors}</span>}
                </div>
              </div>

              {/* Personalization */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Campos de Personalização", "Quais dados pedir ao cliente?")}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[["name", "✏️ Nome"], ["date", "📅 Data especial"], ["message", "💬 Mensagem / Observação"]].map(([field, label]) => (
                    <button key={field} onClick={() => togglePersonField(field)} style={{
                      padding: "10px 18px", borderRadius: 12, fontSize: 13, cursor: "pointer",
                      border: form.personalizationFields.includes(field) ? "2px solid #D29B9B" : "2px solid #f0e8e8",
                      background: form.personalizationFields.includes(field) ? "#fdf0f0" : "#fff",
                      color: form.personalizationFields.includes(field) ? "#D29B9B" : "#9B7B7B",
                      fontFamily: "Nunito, sans-serif", fontWeight: 700, transition: "all 0.2s",
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Status */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Status")}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { key: "inStock", label: "Em estoque", desc: "Produto disponível para venda", icon: "📦" },
                    { key: "featured", label: "Destaque", desc: "Aparece na landing page", icon: "⭐" },
                  ].map(({ key, label, desc, icon }) => (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <div onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))} style={{
                        width: 44, height: 24, borderRadius: 12, position: "relative",
                        background: form[key] ? "#D29B9B" : "#e0d0d0",
                        transition: "background 0.2s", cursor: "pointer", flexShrink: 0,
                      }}>
                        <div style={{
                          position: "absolute", top: 3, left: form[key] ? 23 : 3,
                          width: 18, height: 18, borderRadius: "50%", background: "#fff",
                          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                        }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B" }}>{icon} {label}</div>
                        <div style={{ fontSize: 11, color: "#9B7B7B" }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Organização")}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Categoria</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{
                    ...inputStyle, cursor: "pointer",
                  }}>
                    {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Badge <span style={{ fontWeight: 400, color: "#9B7B7B" }}>(opcional)</span></label>
                  <input style={inputStyle} placeholder="Ex: Novo, Exclusivo, Mais Amado…"
                    value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
                </div>
                <div style={{ marginBottom: 0 }}>
                  <label style={labelStyle}>Tags <span style={{ fontWeight: 400, color: "#9B7B7B" }}>(separe por vírgula)</span></label>
                  <input style={inputStyle} placeholder="Ex: mãe, família, presente"
                    value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
              </div>

              {/* Ratings */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Avaliações")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Nota (0–5)</label>
                    <input style={inputStyle} type="number" step="0.1" min="0" max="5"
                      value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nº Avaliações</label>
                    <input style={inputStyle} type="number" min="0"
                      value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave} style={{
                width: "100%", padding: "15px", borderRadius: 14, border: "none",
                background: saved ? "#759B96" : "linear-gradient(135deg, #D29B9B, #C2877E)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
                boxShadow: "0 6px 20px rgba(194,135,126,0.35)",
                transition: "all 0.3s",
              }}>
                {saved ? "✅ Salvo com sucesso!" : (view === "new" ? "✨ Publicar Produto" : "💾 Salvar Alterações")}
              </button>
            </div>
          </div>
        </div>

        <style>{`@keyframes shake { 0%,100%{transform:none} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @media(max-width:768px){.admin-form-grid{grid-template-columns:1fr!important;}}`}</style>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0f0", padding: "0 0 60px" }}>
      <AdminTopbar onLogout={onLogout} setPage={setPage} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#3D2B2B", margin: "0 0 4px" }}>
              Gerenciar Produtos
            </h1>
            <p style={{ color: "#9B7B7B", fontSize: 14, margin: 0 }}>{products.length} produtos cadastrados</p>
          </div>
          <button onClick={openNew} style={{
            padding: "13px 26px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
            boxShadow: "0 6px 20px rgba(194,135,126,0.35)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>+</span> Novo Produto
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }} className="admin-stats-grid">
          {[
            { label: "Total de Produtos", value: products.length, icon: "📦", color: "#D29B9B" },
            { label: "Em Destaque", value: products.filter(p => p.featured).length, icon: "⭐", color: "#C2877E" },
            { label: "Em Estoque", value: products.filter(p => p.inStock).length, icon: "✅", color: "#759B96" },
            { label: "Avaliação Média", value: (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) + "★", icon: "💖", color: "#D29B9B" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#fff", borderRadius: 16, padding: "20px 22px",
              boxShadow: "0 2px 12px rgba(210,155,155,0.08)",
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, fontFamily: "Nunito, sans-serif" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#9B7B7B", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B89090" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto por nome ou categoria…"
            style={{
              width: "100%", padding: "13px 16px 13px 44px", borderRadius: 14,
              border: "2px solid #f0e8e8", background: "#fff", fontSize: 14,
              fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box",
            }} />
        </div>

        {/* Product table */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px 130px",
            padding: "14px 20px", background: "#fdf9f9",
            borderBottom: "2px solid #f0e8e8", gap: 12,
          }} className="admin-table-header">
            {["Produto", "Categoria", "Preço", "Status", "Nota", "Ações"].map(h => (
              <span key={h} style={{ fontSize: 12, fontWeight: 800, color: "#9B7B7B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ color: "#9B7B7B" }}>Nenhum produto encontrado</p>
            </div>
          ) : filtered.map((p, idx) => (
            <div key={p.id} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px 130px",
              padding: "16px 20px", borderBottom: idx < filtered.length - 1 ? "1px solid #faf0f0" : "none",
              alignItems: "center", gap: 12,
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fdf9f9"}
              onMouseLeave={e => e.currentTarget.style.background = ""}
              className="admin-table-row"
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <ProductImage productId={p.id} size="thumb" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#B89090" }}>
                    {p.featured && <span style={{ background: "#fdf0f0", color: "#D29B9B", padding: "2px 6px", borderRadius: 4, marginRight: 4, fontWeight: 700 }}>Destaque</span>}
                    {p.badge && <span style={{ background: "#f0f5f4", color: "#759B96", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{p.badge}</span>}
                  </div>
                </div>
              </div>

              {/* Category */}
              <span style={{ fontSize: 13, color: "#7A5A5A", textTransform: "capitalize" }}>
                {CATEGORIES.find(c => c.id === p.category)?.label || p.category}
              </span>

              {/* Price */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#C2877E" }}>R$ {p.price.toFixed(2).replace(".", ",")}</div>
                {p.originalPrice && <div style={{ fontSize: 11, color: "#B89090", textDecoration: "line-through" }}>R$ {p.originalPrice.toFixed(2).replace(".", ",")}</div>}
              </div>

              {/* Stock */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 8,
                background: p.inStock ? "#f0f9f4" : "#fdf0f0",
                color: p.inStock ? "#4A9B6A" : "#C2877E",
                fontSize: 12, fontWeight: 700, width: "fit-content",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                {p.inStock ? "Em estoque" : "Esgotado"}
              </div>

              {/* Rating */}
              <div style={{ fontSize: 13, color: "#3D2B2B", fontWeight: 700 }}>
                <span style={{ color: "#C2877E" }}>★</span> {p.rating}
                <div style={{ fontSize: 11, color: "#B89090" }}>{p.reviews} avaliações</div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(p)} style={{
                  width: 36, height: 36, borderRadius: 10, border: "2px solid #f0e8e8",
                  background: "#fff", cursor: "pointer", fontSize: 15,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }} title="Editar">✏️</button>
                <button onClick={() => setDeleteConfirm(p.id)} style={{
                  width: 36, height: 36, borderRadius: 10, border: "2px solid #f0e8e8",
                  background: "#fff", cursor: "pointer", fontSize: 15,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }} title="Excluir">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(61,43,43,0.5)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 32, maxWidth: 380,
            width: "calc(100% - 48px)", textAlign: "center",
            boxShadow: "0 24px 64px rgba(61,43,43,0.2)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: "Playfair Display, serif", color: "#3D2B2B", margin: "0 0 10px" }}>
              Excluir produto?
            </h3>
            <p style={{ color: "#9B7B7B", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
              Esta ação não pode ser desfeita. O produto será removido do catálogo.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8",
                background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
              }}>Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: "#C2877E", color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
              }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .admin-stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .admin-table-header,.admin-table-row{grid-template-columns:1fr 1fr 100px 100px!important;}
          .admin-table-header span:nth-child(5),.admin-table-header span:nth-child(6),
          .admin-table-row>div:nth-child(5),.admin-table-row>div:nth-child(6){display:none!important;}
        }
        @media(max-width:560px){
          .admin-stats-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>
    </div>
  );
};

// Admin top bar shared between login and panel views
const AdminTopbar = ({ onLogout, setPage }) => (
  <div style={{
    background: "#3D2B2B", color: "#fff",
    padding: "0 24px", height: 60,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 50,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 18 }}>🔐</span>
      <div>
        <span style={{ fontFamily: "Playfair Display, serif", fontSize: 16, color: "#D29B9B" }}>Admin</span>
        <span style={{ fontSize: 13, color: "#8B6B6B", marginLeft: 8 }}>Amor de Mãe 3D</span>
      </div>
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button onClick={() => setPage("landing")} style={{
        background: "none", border: "1px solid #5A3F3F", borderRadius: 10,
        padding: "8px 16px", color: "#D29B9B", fontSize: 13, fontWeight: 700,
        cursor: "pointer", fontFamily: "Nunito, sans-serif",
      }}>← Ver loja</button>
      <button onClick={onLogout} style={{
        background: "#C2877E", border: "none", borderRadius: 10,
        padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700,
        cursor: "pointer", fontFamily: "Nunito, sans-serif",
      }}>Sair</button>
    </div>
  </div>
);

Object.assign(window, { AdminPanel, AdminTopbar });
