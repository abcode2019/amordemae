// Favorites Page
const Favorites = ({ products, favorites, toggleFavorite, addToCart, setPage, setSelectedProduct }) => {
  const favProducts = products.filter(p => favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>💝</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, color: "#3D2B2B", margin: "0 0 12px" }}>
            Nenhum favorito ainda
          </h2>
          <p style={{ color: "#9B7B7B", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
            Salve as peças que tocaram seu coração para encontrar facilmente depois.
          </p>
          <button onClick={() => setPage("catalog")} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "16px 36px",
            borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 8px 24px rgba(194,135,126,0.4)",
          }}>Explorar catálogo 💖</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf9f9", paddingTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 8px" }}>
          Meus Favoritos 💖
        </h1>
        <p style={{ color: "#9B7B7B", margin: "0 0 36px" }}>
          {favProducts.length} {favProducts.length === 1 ? "peça salva com amor" : "peças salvas com amor"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="products-grid">
          {favProducts.map(p => (
            <ProductCard
              key={p.id} product={p}
              favorites={favorites} toggleFavorite={toggleFavorite}
              addToCart={addToCart} setPage={setPage} setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Favorites });
