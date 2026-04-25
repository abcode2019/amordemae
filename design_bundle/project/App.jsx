// Main App — state management + routing
const App = () => {
  // Routing
  const [page, setPage] = React.useState("landing");
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Admin auth
  const [isAdmin, setIsAdmin] = React.useState(() => sessionStorage.getItem("amordemae_admin") === "true");
  const [adminPage, setAdminPage] = React.useState(null); // null | "login" | "panel"

  // Products — starts with MOCK_PRODUCTS, extended via admin
  const [products, setProducts] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("amordemae_products") || "null");
      return saved || MOCK_PRODUCTS;
    } catch { return MOCK_PRODUCTS; }
  });

  // Cart state — persisted to localStorage
  const [cart, setCart] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("amordemae_cart") || "[]"); } catch { return []; }
  });

  // Favorites state — persisted to localStorage
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("amordemae_favorites") || "[]"); } catch { return []; }
  });

  // Toast system
  const [toasts, setToasts] = React.useState([]);

  // Persist products
  React.useEffect(() => {
    localStorage.setItem("amordemae_products", JSON.stringify(products));
  }, [products]);

  // Persist cart
  React.useEffect(() => {
    localStorage.setItem("amordemae_cart", JSON.stringify(cart));
  }, [cart]);

  // Persist favorites
  React.useEffect(() => {
    localStorage.setItem("amordemae_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, adminPage]);

  // Listen for goto events (from AdminLogin back button)
  React.useEffect(() => {
    const handler = (e) => {
      setAdminPage(null);
      setPage(e.detail || "landing");
    };
    window.addEventListener("amordemae:goto", handler);
    return () => window.removeEventListener("amordemae:goto", handler);
  }, []);

  // Secret admin access: click logo area 5 times rapidly
  const logoClickCount = React.useRef(0);
  const logoClickTimer = React.useRef(null);
  const handleLogoSecret = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      if (isAdmin) {
        setAdminPage("panel");
      } else {
        setAdminPage("login");
      }
    }
  };

  const showToast = (message, type = "success", icon = "💖") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  // Cart actions
  const addToCart = (product, personalization = {}) => {
    const id = Date.now();
    setCart(c => [...c, { id, product, personalization, qty: 1 }]);
    showToast(`${product.name} adicionado ao carrinho!`, "success", "🛒");
  };

  const updateQty = (itemId, qty) => {
    if (qty < 1) { removeFromCart(itemId); return; }
    setCart(c => c.map(item => item.id === itemId ? { ...item, qty } : item));
  };

  const removeFromCart = (itemId) => {
    setCart(c => c.filter(item => item.id !== itemId));
    showToast("Item removido do carrinho", "info", "🗑️");
  };

  // Favorites toggle
  const toggleFavorite = (productId) => {
    setFavorites(f => {
      const isFav = f.includes(productId);
      if (isFav) {
        showToast("Removido dos favoritos", "info", "💔");
        return f.filter(id => id !== productId);
      } else {
        showToast("Adicionado aos favoritos!", "success", "💖");
        return [...f, productId];
      }
    });
  };

  // Admin product actions
  const handleAddProduct = (product) => {
    setProducts(ps => [...ps, product]);
    showToast("Produto publicado com sucesso!", "success", "✨");
  };

  const handleEditProduct = (updated) => {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    showToast("Produto atualizado!", "success", "💾");
  };

  const handleDeleteProduct = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    showToast("Produto removido.", "info", "🗑️");
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setAdminPage("panel");
    showToast("Bem-vinda ao painel admin! 🔐", "success", "✅");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("amordemae_admin");
    setIsAdmin(false);
    setAdminPage(null);
    showToast("Sessão encerrada.", "info", "👋");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const favCount = favorites.length;

  const sharedProps = {
    favorites, toggleFavorite, addToCart,
    setPage: (p) => { setAdminPage(null); setPage(p); },
    setSelectedProduct, showToast,
  };

  // --- Admin pages ---
  if (adminPage === "login") {
    return (
      <>
        <AdminLogin onLogin={handleAdminLogin} />
        <Toast toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  if (adminPage === "panel") {
    return (
      <>
        <AdminPanel
          products={products}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onLogout={handleAdminLogout}
          setPage={(p) => { setAdminPage(null); setPage(p); }}
        />
        <Toast toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // --- Store pages ---
  const renderPage = () => {
    switch (page) {
      case "landing":
        return <Landing {...sharedProps} products={products} />;
      case "catalog":
        return <Catalog {...sharedProps} products={products} />;
      case "product":
        return selectedProduct
          ? <ProductDetail {...sharedProps} product={selectedProduct} />
          : <Catalog {...sharedProps} products={products} />;
      case "cart":
        return <Cart cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} setPage={sharedProps.setPage} />;
      case "favorites":
        return <Favorites {...sharedProps} products={products} />;
      default:
        return <Landing {...sharedProps} products={products} />;
    }
  };

  return (
    <div style={{ fontFamily: "Nunito, sans-serif", background: "#fdf9f9", minHeight: "100vh" }}>
      <Navbar
        page={page} setPage={sharedProps.setPage}
        cartCount={cartCount} favCount={favCount}
        onLogoClick={handleLogoSecret}
        isAdmin={isAdmin}
        onAdminClick={() => setAdminPage("panel")}
      />
      {renderPage()}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
