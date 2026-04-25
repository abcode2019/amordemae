// Shared ProductCard component used in Landing and Catalog
const ProductCard = ({ product, favorites, toggleFavorite, addToCart, setPage, setSelectedProduct }) => {
  const isFav = favorites.includes(product.id);
  const [hovered, setHovered] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, { size: product.sizes[0], color: product.colors[0], name: "", date: "", message: "" });
  };

  const handleViewDetail = () => {
    setSelectedProduct(product);
    setPage("product");
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: hovered ? "0 12px 40px rgba(210,155,155,0.2)" : "0 4px 20px rgba(210,155,155,0.1)",
        border: "1px solid #f8f0f0", cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }} onClick={handleViewDetail}>
        <div style={{ width: "100%", height: "100%", borderRadius: 0 }}>
          <ProductImage productId={product.id} size="full" />
        </div>
        {product.badge && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "4px 10px", borderRadius: 8,
            boxShadow: "0 2px 8px rgba(194,135,126,0.4)",
          }}>{product.badge}</div>
        )}
        {product.originalPrice && (
          <div style={{
            position: "absolute", top: 12, right: product.badge ? "auto" : 12,
            right: 12,
            background: "#759B96", color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "4px 10px", borderRadius: 8,
          }}>
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {/* Favorite btn */}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}
          style={{
            position: "absolute", bottom: 12, right: 12,
            background: isFav ? "#D29B9B" : "rgba(255,255,255,0.9)",
            border: "none", width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={isFav ? "#fff" : "none"} stroke={isFav ? "#fff" : "#D29B9B"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h3 onClick={handleViewDetail} style={{
            margin: 0, fontSize: 15, fontWeight: 700, color: "#3D2B2B",
            fontFamily: "Nunito, sans-serif", lineHeight: 1.3,
            cursor: "pointer",
          }}>{product.name}</h3>
        </div>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#9B7B7B", lineHeight: 1.5 }}>
          {product.shortDescription}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: "#B89090", textDecoration: "line-through" }}>
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ color: "#C2877E", fontSize: 12 }}>★</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B" }}>{product.rating}</span>
            <span style={{ fontSize: 11, color: "#B89090" }}>({product.reviews})</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleViewDetail} style={{
            flex: 1, padding: "10px", borderRadius: 12,
            border: "2px solid #f0e8e8", background: "#fff",
            color: "#C2877E", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
            transition: "all 0.2s",
          }}>Ver detalhes</button>
          <button onClick={handleAddToCart} style={{
            flex: 1, padding: "10px", borderRadius: 12,
            border: "none", background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 12px rgba(194,135,126,0.35)",
            transition: "all 0.2s",
          }}>+ Carrinho</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ProductCard });
