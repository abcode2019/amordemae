// Catalog Page
const Catalog = ({ products, favorites, toggleFavorite, addToCart, setPage, setSelectedProduct }) => {
  const [activeCategory, setActiveCategory] = React.useState("todos");
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("default");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    let list = [...products];
    if (activeCategory !== "todos") list = list.filter(p => p.category === activeCategory);
    if (search.trim()) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.includes(search.toLowerCase()))
    );
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #fdf0f0, #f8eae8)",
        padding: "48px 24px 40px", borderBottom: "1px solid #f0e8e8",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 40, color: "#3D2B2B", margin: "0 0 8px" }}>
            Nosso Catálogo
          </h1>
          <p style={{ color: "#9B7B7B", fontSize: 16, margin: "0 0 28px" }}>
            Cada peça, uma lembrança. Escolha a sua com carinho.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B89090" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar peças personalizadas…"
              style={{
                width: "100%", padding: "14px 16px 14px 48px",
                borderRadius: 14, border: "2px solid #f0e8e8",
                background: "#fff", fontSize: 15, fontFamily: "Nunito, sans-serif",
                outline: "none", boxSizing: "border-box",
                boxShadow: "0 2px 12px rgba(210,155,155,0.1)",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Filters row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
                padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
                border: activeCategory === c.id ? "none" : "2px solid #f0e8e8",
                background: activeCategory === c.id ? "linear-gradient(135deg, #D29B9B, #C2877E)" : "#fff",
                color: activeCategory === c.id ? "#fff" : "#9B7B7B",
                transition: "all 0.2s",
                boxShadow: activeCategory === c.id ? "0 4px 12px rgba(194,135,126,0.35)" : "none",
              }}>{c.label}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: "10px 16px", borderRadius: 12, border: "2px solid #f0e8e8",
            background: "#fff", fontSize: 13, fontFamily: "Nunito, sans-serif",
            color: "#3D2B2B", outline: "none", cursor: "pointer",
          }}>
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Mais avaliados</option>
          </select>
        </div>

        {/* Count */}
        {!loading && (
          <p style={{ fontSize: 14, color: "#9B7B7B", marginBottom: 24 }}>
            {filtered.length} {filtered.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="products-grid">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Playfair Display, serif", color: "#3D2B2B", margin: "0 0 8px" }}>
              Nenhuma peça encontrada
            </h3>
            <p style={{ color: "#9B7B7B" }}>Tente outro termo ou categoria</p>
            <button onClick={() => { setSearch(""); setActiveCategory("todos"); }} style={{
              marginTop: 20, padding: "12px 24px", borderRadius: 12,
              background: "linear-gradient(135deg, #D29B9B, #C2877E)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>Ver tudo</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="products-grid">
            {filtered.map(p => (
              <ProductCard
                key={p.id} product={p}
                favorites={favorites} toggleFavorite={toggleFavorite}
                addToCart={addToCart} setPage={setPage} setSelectedProduct={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { Catalog });
