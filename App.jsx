// Main App — state management + routing
const App = () => {
  // --- URL routing helpers ---
  const pathToRoute = (pathname) => {
    if (pathname === "/" || pathname === "" || pathname === "/index.html") return { page: "landing" };
    if (pathname === "/catalogo") return { page: "catalog" };
    if (pathname.startsWith("/produto/")) return { page: "product", productId: pathname.slice(9) };
    if (pathname === "/carrinho") return { page: "cart" };
    if (pathname === "/favoritos") return { page: "favorites" };
    if (pathname === "/admin/login") return { page: "landing", admin: "login" };
    if (pathname.startsWith("/admin")) return { page: "landing", admin: "panel" };
    return { page: "landing" };
  };

  const pageToPath = (pg, product) => {
    if (pg === "catalog")   return "/catalogo";
    if (pg === "product")   return product ? `/produto/${product.id}` : "/catalogo";
    if (pg === "cart")      return "/carrinho";
    if (pg === "favorites") return "/favoritos";
    return "/";
  };

  const initialRoute = pathToRoute(window.location.pathname);

  // Routing
  const [page, setPageState] = React.useState(initialRoute.page);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Admin auth — Supabase Auth
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [adminPage, setAdminPageState] = React.useState(initialRoute.admin || null);

  // Wrapper para setAdminPage que também atualiza a URL
  const setAdminPage = (ap) => {
    setAdminPageState(ap);
    if (ap === "panel") {
      window.history.pushState({}, "", "/admin");
    } else if (ap === "login") {
      window.history.pushState({}, "", "/admin/login");
    }
    // se ap === null, a URL será atualizada pelo sync de página
  };

  // Products — inicia vazio, carrega do Supabase no mount
  const [products, setProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = React.useState(true);

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

  // Helper: converte row do Supabase (PT) → objeto do frontend
  const rowToProduct = (row) => ({
    id: row.id,
    name: row.nome,
    price: Number(row.preco),
    originalPrice: row.preco_original != null ? Number(row.preco_original) : null,
    category: row.categoria,
    description: row.descricao || '',
    shortDescription: row.descricao_curta || '',
    sizes: row.tamanhos || [],
    colors: row.cores || [],
    images: row.imagens || [],
    badge: row.badge,
    rating: Number(row.avaliacao || 0),
    reviews: row.num_avaliacoes || 0,
    tags: row.tags || [],
    personalizationFields: row.campos_personalizacao || [],
    sizePrices: (row.precos_por_tamanho || []).map(sp => ({
      size: sp.tamanho || sp.size,
      price: Number(sp.preco || sp.price || 0),
      originalPrice: sp.preco_original != null ? Number(sp.preco_original) : (sp.originalPrice != null ? Number(sp.originalPrice) : null),
    })),
    featured: row.destaque,
    inStock: row.em_estoque,
  });

  // Helper: converte produto do frontend → row do Supabase (PT)
  const productToRow = (product) => ({
    nome: product.name,
    preco: product.price,
    preco_original: product.originalPrice,
    categoria: product.category,
    descricao: product.description,
    descricao_curta: product.shortDescription,
    tamanhos: product.sizes || [],
    cores: product.colors || [],
    imagens: (product.images || []).filter(img => typeof img === 'string'),
    badge: product.badge || null,
    avaliacao: product.rating || 0,
    num_avaliacoes: product.reviews || 0,
    tags: product.tags || [],
    campos_personalizacao: product.personalizationFields || [],
    precos_por_tamanho: (product.sizePrices || []).map(sp => ({
      tamanho: sp.size || sp.tamanho,
      preco: sp.price || sp.preco,
      preco_original: sp.originalPrice || sp.preco_original || null,
    })),
    destaque: product.featured || false,
    em_estoque: product.inStock !== false,
  });

  // Carrega/recarrega produtos do Supabase
  const reloadProducts = () => {
    setLoadingProducts(true);
    db.from('produtos').select('*').order('id').then(({ data, error }) => {
      if (error) {
        console.error('Erro ao carregar produtos:', error);
      }
      setProducts(!error && data ? data.map(rowToProduct) : []);
      setLoadingProducts(false);
    });
  };

  // Carrega produtos no mount
  React.useEffect(() => { reloadProducts(); }, []);

  // Verifica sessão admin no mount + escuta mudanças de auth
  React.useEffect(() => {
    db.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
      if (!session) {
        setAdminPage(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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

  // Resolve product when app loads directly on /produto/:id
  React.useEffect(() => {
    if (initialRoute.page === "product" && initialRoute.productId) {
      const found = products.find(p => String(p.id) === String(initialRoute.productId));
      if (found) setSelectedProduct(found);
      else setPageState("catalog");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL (pushState on navigation) — skip when admin is active
  React.useEffect(() => {
    if (adminPage) return; // admin manages its own URL
    const path = pageToPath(page, selectedProduct);
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  }, [page, selectedProduct, adminPage]);

  // Sync URL → state (browser back / forward)
  React.useEffect(() => {
    const handler = () => {
      const route = pathToRoute(window.location.pathname);
      if (route.admin) {
        setAdminPageState(route.admin);
      } else {
        setAdminPageState(null);
        setPageState(route.page);
        if (route.page === "product" && route.productId) {
          const found = products.find(p => String(p.id) === String(route.productId));
          if (found) setSelectedProduct(found);
          else setPageState("catalog");
        }
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [products]);

  // Listen for goto events (from AdminLogin back button)
  React.useEffect(() => {
    const handler = (e) => {
      setAdminPageState(null);
      const target = e.detail || "landing";
      setPageState(target);
      window.history.pushState({}, "", pageToPath(target));
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

  // Admin product actions — persistidos no Supabase
  const handleAddProduct = async (product) => {
    const row = productToRow(product);
    const { data, error } = await db.from('produtos').insert(row).select().single();
    if (error) {
      console.error('Erro ao salvar produto:', error);
      showToast("Erro ao salvar produto: " + error.message, "error", "❌");
      return;
    }
    setProducts(ps => [...ps, rowToProduct(data)]);
    showToast("Produto publicado com sucesso!", "success", "✨");
  };

  const handleEditProduct = async (updated) => {
    const row = productToRow(updated);
    const { error } = await db.from('produtos').update(row).eq('id', updated.id);
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      showToast("Erro ao atualizar produto: " + error.message, "error", "❌");
      return;
    }
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    showToast("Produto atualizado!", "success", "💾");
  };

  const handleDeleteProduct = async (id) => {
    const { error } = await db.from('produtos').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir produto:', error);
      showToast("Erro ao excluir produto: " + error.message, "error", "❌");
      return;
    }
    setProducts(ps => ps.filter(p => p.id !== id));
    showToast("Produto removido.", "info", "🗑️");
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setAdminPage("panel");
    showToast("Bem-vinda ao painel admin! 🔐", "success", "✅");
  };

  const handleAdminLogout = async () => {
    await db.auth.signOut();
    setIsAdmin(false);
    setAdminPageState(null);
    window.history.pushState({}, "", "/");
    setPageState("landing");
    showToast("Sessão encerrada.", "info", "👋");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const favCount = favorites.length;

  const navigateTo = (p) => {
    setAdminPageState(null);
    setPageState(p);
    window.history.pushState({}, "", pageToPath(p));
  };

  const sharedProps = {
    favorites, toggleFavorite, addToCart,
    setPage: navigateTo,
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
          setPage={navigateTo}
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
