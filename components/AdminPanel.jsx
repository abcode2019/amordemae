// Admin Panel — Product Management
const EMPTY_PRODUCT = {
  name: "", category: "decoracao",
  description: "", shortDescription: "",
  sizePrices: [{ size: "", price: "", originalPrice: "" }],
  colors: "", badge: "", tags: "",
  rating: "5.0", reviews: "0", featured: false, inStock: true,
  personalizationFields: ["name", "date", "message"],
  images: [],
};

const STATUS_MAP = {
  pendente:    { label: "Pendente",     color: "#C2877E", bg: "#fdf0f0" },
  confirmado:  { label: "Confirmado",   color: "#759B96", bg: "#f0f5f4" },
  producao: { label: "Em Produção",  color: "#8B6B4A", bg: "#f8f5f0" },
  enviado:    { label: "Enviado",      color: "#4A6A9B", bg: "#f0f4f9" },
  entregue:  { label: "Entregue",     color: "#4A9B6A", bg: "#f0f9f4" },
  cancelado:  { label: "Cancelado",    color: "#9B4A4A", bg: "#f9f0f0" },
};

const OrdersView = ({ products, onLogout, setPage, onBack }) => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState(null);
  
  // Dashboard & Manual Entry state
  const [showManual, setShowManual] = React.useState(false);
  const [manualForm, setManualForm] = React.useState({ 
    nome_cliente: '', total: '', status: 'entregue', observacoes: '',
    produto_id: '', quantidade: 1 
  });

  // Delete Confirmation state
  const [deleteOrderId, setDeleteOrderId] = React.useState(null);

  const load = () => {
    setLoading(true);
    db.from('pedidos')
      .select('*, itens_pedido(*)')
      .order('criado_em', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data);
        setLoading(false);
      });
  };

  React.useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    await db.from('pedidos').update({ status }).eq('id', orderId);
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrder = async () => {
    if (!deleteOrderId) return;
    const { error } = await db.from('pedidos').delete().eq('id', deleteOrderId);
    if (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir o pedido. Por favor, verifique as permissões do banco de dados.");
    } else {
      setOrders(os => os.filter(o => o.id !== deleteOrderId));
    }
    setDeleteOrderId(null);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const { data } = await db.from('pedidos').insert({
      nome_cliente: manualForm.nome_cliente.trim() || 'Venda Manual',
      total: Number(manualForm.total.toString().replace(',', '.')),
      status: manualForm.status,
      observacoes: manualForm.observacoes,
    }).select('*, itens_pedido(*)').single();
    if (data) {
      if (manualForm.produto_id) {
        const prod = products.find(p => String(p.id) === manualForm.produto_id);
        if (prod) {
          const { error: itemError } = await db.from('itens_pedido').insert({
            pedido_id: data.id,
            produto_id: prod.id,
            nome_produto: prod.name,
            preco_unitario: prod.price,
            quantidade: manualForm.quantidade || 1
          });
          if (!itemError) {
             data.itens_pedido = [{
                id: Date.now(),
                pedido_id: data.id,
                produto_id: prod.id,
                nome_produto: prod.name,
                preco_unitario: prod.price,
                quantidade: manualForm.quantidade || 1
             }];
          }
        }
      }
      setOrders([data, ...orders]);
      setShowManual(false);
      setManualForm({ nome_cliente: '', total: '', status: 'entregue', observacoes: '', produto_id: '', quantidade: 1 });
    }
  };

  const fmt = (val) => Number(val).toFixed(2).replace(".", ",");
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

  const countPendente = orders.filter(o => o.status === 'pendente').length;
  const countProducao = orders.filter(o => o.status === 'producao').length;
  const countEntregue = orders.filter(o => o.status === 'entregue').length;
  const valorEntregue = orders.filter(o => o.status === 'entregue').reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0f0", padding: "0 0 60px" }}>
      <AdminTopbar onLogout={onLogout} setPage={setPage} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#9B7B7B", fontFamily: "Nunito, sans-serif", marginBottom: 8, display: "block" }}>
              ← Voltar para Produtos
            </button>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#3D2B2B", margin: "0 0 4px" }}>Pedidos</h1>
            <p style={{ color: "#9B7B7B", fontSize: 14, margin: 0 }}>{orders.length} pedido{orders.length !== 1 ? "s" : ""} registrado{orders.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setShowManual(true)} style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #D29B9B, #C2877E)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
              boxShadow: "0 4px 12px rgba(210,155,155,0.3)"
            }}>+ Lançamento Manual</button>
            <button onClick={load} style={{
              padding: "11px 22px", borderRadius: 12, border: "2px solid #f0e8e8",
              background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>↻ Atualizar</button>
          </div>
        </div>

        {/* Dashboard */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #f0e8e8", boxShadow: "0 2px 12px rgba(210,155,155,0.05)" }}>
            <div style={{ fontSize: 13, color: "#9B7B7B", fontWeight: 700, marginBottom: 8 }}>VENDAS CONCLUÍDAS</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#4A9B6A", fontFamily: "Nunito, sans-serif" }}>R$ {fmt(valorEntregue)}</div>
            <div style={{ fontSize: 12, color: "#B89090", marginTop: 4 }}>{countEntregue} pedidos entregues</div>
          </div>
          <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #f0e8e8", boxShadow: "0 2px 12px rgba(210,155,155,0.05)" }}>
            <div style={{ fontSize: 13, color: "#9B7B7B", fontWeight: 700, marginBottom: 8 }}>EM PRODUÇÃO</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#8B6B4A", fontFamily: "Nunito, sans-serif" }}>{countProducao}</div>
            <div style={{ fontSize: 12, color: "#B89090", marginTop: 4 }}>sendo fabricados</div>
          </div>
          <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #f0e8e8", boxShadow: "0 2px 12px rgba(210,155,155,0.05)" }}>
            <div style={{ fontSize: 13, color: "#9B7B7B", fontWeight: 700, marginBottom: 8 }}>PENDENTES</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>{countPendente}</div>
            <div style={{ fontSize: 12, color: "#B89090", marginTop: 4 }}>aguardando confirmação</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#9B7B7B", fontSize: 15 }}>Carregando pedidos…</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ color: "#9B7B7B", fontSize: 16 }}>Nenhum pedido ainda</p>
          </div>
        ) : orders.map(order => {
          const st = STATUS_MAP[order.status] || STATUS_MAP.pendente;
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, boxShadow: "0 2px 12px rgba(210,155,155,0.08)", overflow: "hidden" }}>
              {/* Row */}
              <div
                onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{ padding: "16px 20px", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 1fr 110px 130px 60px", gap: 12, alignItems: "center" }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>{order.nome_cliente || "—"}</div>
                  <div style={{ fontSize: 12, color: "#9B7B7B" }}>{order.telefone_cliente || "sem telefone"}</div>
                  <div style={{ fontSize: 11, color: "#B89090", marginTop: 2 }}>{fmtDate(order.criado_em)}</div>
                </div>
                <div style={{ fontSize: 13, color: "#7A5A5A" }}>
                  {(order.itens_pedido || []).length} {(order.itens_pedido || []).length === 1 ? "item" : "itens"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
                  R$ {fmt(order.total)}
                </div>
                <select
                  value={order.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  style={{
                    padding: "6px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                    border: "2px solid " + st.color, background: st.bg, color: st.color,
                    fontFamily: "Nunito, sans-serif", cursor: "pointer", outline: "none",
                  }}
                >
                  {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); setDeleteOrderId(order.id); }} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#C2877E", padding: "4px"
                  }} title="Excluir">🗑️</button>
                  <span style={{ fontSize: 16, color: "#B89090", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
              </div>

              {/* Items expandido */}
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0e8e8", padding: "16px 20px", background: "#fdf9f9" }}>
                  {(order.itens_pedido || []).length === 0 ? (
                    <p style={{ color: "#9B7B7B", fontSize: 13, margin: 0 }}>Sem itens registrados</p>
                  ) : (order.itens_pedido || []).map(item => (
                    <div key={item.id} style={{
                      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                      gap: 12, padding: "10px 0",
                      borderBottom: "1px solid #f5eded", alignItems: "start",
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B" }}>{item.nome_produto}</div>
                        {item.personalizacao_nome && <div style={{ fontSize: 11, color: "#9B7B7B" }}>✏️ {item.personalizacao_nome}</div>}
                        {item.personalizacao_data && <div style={{ fontSize: 11, color: "#9B7B7B" }}>📅 {item.personalizacao_data}</div>}
                        {item.personalizacao_msg && <div style={{ fontSize: 11, color: "#9B7B7B" }}>💬 {item.personalizacao_msg}</div>}
                      </div>
                      <div style={{ fontSize: 12, color: "#7A5A5A" }}>
                        {item.tamanho && <div>{item.tamanho}</div>}
                        {item.cor && <div>{item.cor}</div>}
                      </div>
                      <div style={{ fontSize: 13, color: "#9B7B7B" }}>× {item.quantidade}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#C2877E", textAlign: "right" }}>
                        R$ {fmt(item.preco_unitario * item.quantidade)}
                      </div>
                    </div>
                  ))}
                  {order.observacoes && (
                    <div style={{ marginTop: 12, padding: 12, background: "#fff8f0", borderRadius: 10, fontSize: 13, color: "#8B6B4A" }}>
                      💬 {order.observacoes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Entry Modal */}
      {showManual && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24
        }} onClick={() => setShowManual(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 24, padding: 32, maxWidth: 420, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease"
          }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#3D2B2B", margin: "0 0 20px" }}>
              Lançamento Manual
            </h2>
            <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Cliente / Descrição</label>
                <input required placeholder="Ex: Venda Feira / Maria" value={manualForm.nome_cliente}
                  onChange={e => setManualForm(f => ({...f, nome_cliente: e.target.value}))}
                  style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Produto Adquirido <span style={{fontWeight:400, color:"#9B7B7B"}}>(opcional)</span></label>
                <select value={manualForm.produto_id} onChange={e => {
                  const pid = e.target.value;
                  const prod = products.find(p => String(p.id) === pid);
                  setManualForm(f => ({
                    ...f, 
                    produto_id: pid,
                    total: prod && !f.total ? prod.price.toString() : f.total
                  }));
                }}
                  style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                  <option value="">-- Apenas registrar valor --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (R$ {fmt(p.price)})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: manualForm.produto_id ? "1fr 2fr" : "1fr", gap: 12 }}>
                {manualForm.produto_id && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Qtd.</label>
                    <input type="number" min="1" value={manualForm.quantidade}
                      onChange={e => {
                        const qty = Number(e.target.value);
                        const prod = products.find(p => String(p.id) === manualForm.produto_id);
                        setManualForm(f => ({
                          ...f, quantidade: qty,
                          total: prod ? (prod.price * qty).toString() : f.total
                        }));
                      }}
                      style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Valor Total (R$)</label>
                  <input required type="number" step="0.01" min="0" placeholder="100.00" value={manualForm.total}
                    onChange={e => setManualForm(f => ({...f, total: e.target.value}))}
                    style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Status Inicial</label>
                <select value={manualForm.status} onChange={e => setManualForm(f => ({...f, status: e.target.value}))}
                  style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                  {Object.entries(STATUS_MAP).map(([val, {label}]) => <option key={val} value={val}>{label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", marginBottom: 6, display: "block" }}>Observações (opcional)</label>
                <textarea placeholder="Detalhes do pedido manual..." value={manualForm.observacoes}
                  onChange={e => setManualForm(f => ({...f, observacoes: e.target.value}))}
                  style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", fontSize: 14, boxSizing: "border-box", minHeight: 80, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setShowManual(false)} style={{
                  flex: 1, padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8", background: "#fff", color: "#9B7B7B", fontWeight: 700, cursor: "pointer"
                }}>Cancelar</button>
                <button type="submit" style={{
                  flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "#759B96", color: "#fff", fontWeight: 700, cursor: "pointer"
                }}>Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOrderId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24
        }} onClick={() => setDeleteOrderId(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 24, padding: 32, maxWidth: 360, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease", textAlign: "center"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "#3D2B2B", margin: "0 0 12px" }}>
              Excluir Pedido?
            </h2>
            <p style={{ color: "#9B7B7B", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>
              Tem certeza que deseja apagar este pedido? Esta ação não poderá ser desfeita.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteOrderId(null)} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "2px solid #f0e8e8",
                background: "#fff", color: "#9B7B7B", fontWeight: 700, cursor: "pointer",
                fontFamily: "Nunito, sans-serif"
              }}>Cancelar</button>
              <button onClick={deleteOrder} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: "#C2877E", color: "#fff", fontWeight: 700, cursor: "pointer",
                fontFamily: "Nunito, sans-serif", boxShadow: "0 4px 12px rgba(194,135,126,0.3)"
              }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ products, onAddProduct, onEditProduct, onDeleteProduct, onLogout, setPage }) => {
  const getInitialView = () => {
    const p = window.location.pathname;
    if (p === "/admin/pedidos") return "orders";
    if (p === "/admin/produto/novo") return "new";
    if (p.startsWith("/admin/produto/editar/")) return "edit";
    return "list";
  };

  const [view, setView] = React.useState(getInitialView); // list | new | edit | orders
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [form, setForm] = React.useState(EMPTY_PRODUCT);
  const [errors, setErrors] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const [saved, setSaved] = React.useState(false);

  // Sync /admin/produto/editar/:id when products load
  React.useEffect(() => {
    const p = window.location.pathname;
    if (p.startsWith("/admin/produto/editar/")) {
      const id = p.split("/").pop();
      const prod = products.find(x => String(x.id) === id);
      if (prod) {
        setEditingProduct(prod);
        if (view !== "edit") setView("edit");
      }
    }
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  // Push state when view changes
  React.useEffect(() => {
    let path = "/admin";
    if (view === "orders") path = "/admin/pedidos";
    else if (view === "new") path = "/admin/produto/novo";
    else if (view === "edit" && editingProduct) path = `/admin/produto/editar/${editingProduct.id}`;
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  }, [view, editingProduct]);

  // Handle browser back/forward
  React.useEffect(() => {
    const handler = () => {
      const p = window.location.pathname;
      if (p === "/admin/pedidos") setView("orders");
      else if (p === "/admin/produto/novo") {
        setEditingProduct(null);
        setView("new");
      }
      else if (p.startsWith("/admin/produto/editar/")) {
        const id = p.split("/").pop();
        const prod = products.find(x => String(x.id) === id);
        if (prod) {
          setEditingProduct(prod);
          setView("edit");
        } else setView("list");
      } else {
        setView("list");
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [products]);
  const [uploading, setUploading] = React.useState(false);
  const [newFiles, setNewFiles] = React.useState([]);
  const [previewUrls, setPreviewUrls] = React.useState([]);
  const fileInputRef = React.useRef(null);

  // Price calculator modal
  const [showPriceCalc, setShowPriceCalc] = React.useState(false);
  const [calcKgPrice, setCalcKgPrice] = React.useState('');
  const [calcGrams, setCalcGrams]     = React.useState('');
  const [calcOverhead, setCalcOverhead]     = React.useState(15);
  const [calcMultiplier, setCalcMultiplier] = React.useState(3);
  const [calcTargetIdx, setCalcTargetIdx]   = React.useState(0);

  const calcMaterial  = calcKgPrice && calcGrams ? (Number(calcKgPrice) / 1000) * Number(calcGrams) : 0;
  const calcTotalCost = calcMaterial * (1 + Number(calcOverhead) / 100);
  const calcSuggested = calcTotalCost * Number(calcMultiplier);
  const calcReady     = calcMaterial > 0;

  const applyCalcPrice = () => {
    updateSizePrice(calcTargetIdx, "price", calcSuggested.toFixed(2));
    setShowPriceCalc(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(EMPTY_PRODUCT);
    setErrors({});
    setSaved(false);
    setNewFiles([]);
    setPreviewUrls([]);
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
      images: (product.images || []).filter(img => typeof img === 'string' && img.startsWith('http')),
    });
    setErrors({});
    setSaved(false);
    setNewFiles([]);
    setPreviewUrls([]);
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
      images: [1, 2, 3], // placeholder — será substituído pelos URLs reais
    };
  };

  // Upload de imagens para Supabase Storage
  const uploadImages = async () => {
    if (newFiles.length === 0) return form.images || [];

    setUploading(true);
    const uploadedUrls = [...(form.images || [])];

    for (const file of newFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `imagens/${fileName}`;

      // Converter o arquivo para ArrayBuffer e passar o contentType
      // Isso previne que navegadores de celular enviem arquivos com 0 bytes
      const arrayBuffer = await file.arrayBuffer();

      const { error } = await db.storage.from('produtos').upload(path, arrayBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

      if (!error) {
        const { data: urlData } = db.storage.from('produtos').getPublicUrl(path);
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      } else {
        console.error('Erro ao fazer upload:', error);
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  // Remover imagem existente
  const removeExistingImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  // Adicionar novos arquivos
  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    setNewFiles(prev => [...prev, ...validFiles]);
    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewFile = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaved(false);
    try {
      // Primeiro faz upload das imagens novas
      const allImages = await uploadImages();
      const product = buildProduct(view === "new" ? 0 : editingProduct.id);
      product.images = allImages;

      if (view === "new") {
        await onAddProduct(product);
      } else {
        await onEditProduct(product);
      }
      setSaved(true);
      setNewFiles([]);
      setPreviewUrls([]);
      setTimeout(() => { setView("list"); setSaved(false); }, 1200);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const handleDelete = async (id) => {
    await onDeleteProduct(id);
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
    { value: "religioso", label: "Artigo Religioso" },
  ];

  // --- ORDERS VIEW ---
  if (view === "orders") {
    return <OrdersView products={products} onLogout={onLogout} setPage={setPage} onBack={() => setView("list")} />;
  }

  // --- FORM VIEW ---
  if (view === "new" || view === "edit") {
    return (
      <>
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

              {/* Imagens do Produto */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                {sectionTitle("Fotos do Produto", "Adicione fotos reais do produto (recomendado: 3 a 5 fotos)")}

                {/* Imagens existentes */}
                {(form.images?.length > 0 || previewUrls.length > 0) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 16 }}>
                    {/* URLs já salvas */}
                    {(form.images || []).map((url, idx) => (
                      <div key={`existing-${idx}`} style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", border: idx === 0 ? "3px solid #D29B9B" : "2px solid #f0e8e8" }}>
                        <img src={url} alt={`Foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        {idx === 0 && (
                          <div style={{ position: "absolute", bottom: 6, left: 6, background: "#D29B9B", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>CAPA</div>
                        )}
                        <button
                          onClick={() => removeExistingImage(idx)}
                          style={{
                            position: "absolute", top: 6, right: 6,
                            width: 24, height: 24, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", border: "none",
                            color: "#fff", fontSize: 14, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >×</button>
                      </div>
                    ))}

                    {/* Previews dos novos arquivos */}
                    {previewUrls.map((url, idx) => (
                      <div key={`new-${idx}`} style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", border: "2px dashed #D29B9B" }}>
                        <img src={url} alt={`Nova foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.85 }} />
                        <div style={{ position: "absolute", bottom: 6, left: 6, background: "#759B96", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>NOVA</div>
                        <button
                          onClick={() => removeNewFile(idx)}
                          style={{
                            position: "absolute", top: 6, right: 6,
                            width: 24, height: 24, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", border: "none",
                            color: "#fff", fontSize: 14, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone / Botão de upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#D29B9B'; e.currentTarget.style.background = '#fdf8f8'; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = '#f0e8e8'; e.currentTarget.style.background = '#fafafa'; }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f0e8e8'; e.currentTarget.style.background = '#fafafa'; handleFileSelect(e.dataTransfer.files); }}
                  style={{
                    border: "2px dashed #f0e8e8", borderRadius: 16,
                    padding: "32px 24px", textAlign: "center",
                    cursor: "pointer", background: "#fafafa",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B", marginBottom: 4 }}>Clique ou arraste fotos aqui</div>
                  <div style={{ fontSize: 12, color: "#9B7B7B" }}>JPG, PNG ou WebP • Máx. 5MB por foto</div>
                  {uploading && (
                    <div style={{ marginTop: 12, fontSize: 13, color: "#D29B9B", fontWeight: 700 }}>
                      ⏳ Fazendo upload...
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ''; }}
                />
              </div>

              {/* Tamanhos e Preços */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: "0 2px 12px rgba(210,155,155,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #f0e8e8" }}>
                  <div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#3D2B2B", margin: 0 }}>Tamanhos e Preços</h3>
                    <p style={{ fontSize: 13, color: "#9B7B7B", margin: "4px 0 0" }}>Defina o preço para cada tamanho disponível</p>
                  </div>
                  <button onClick={() => { setCalcTargetIdx(0); setShowPriceCalc(true); }} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10, border: "2px solid #f0e8e8",
                    background: "#fdf9f9", color: "#8B6B4A", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "Nunito, sans-serif", flexShrink: 0,
                  }}>
                    🧮 Calcular preço
                  </button>
                </div>
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
                {sectionTitle("Campos de Personalização", "Ative os dados que o cliente deverá preencher")}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { field: "name",    icon: "✏️", label: "Nome / Texto principal",  badge: "obrigatório se ativo" },
                    { field: "date",    icon: "📅", label: "Data especial",            badge: "opcional" },
                    { field: "message", icon: "💬", label: "Mensagem / Observação",    badge: "opcional" },
                  ].map(({ field, icon, label, badge }) => {
                    const active = form.personalizationFields.includes(field);
                    return (
                      <div key={field} onClick={() => togglePersonField(field)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "13px 16px", borderRadius: 14, cursor: "pointer",
                        border: "2px solid " + (active ? "#D29B9B" : "#f0e8e8"),
                        background: active ? "#fdf8f8" : "#fafafa",
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{icon}</span>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#3D2B2B" : "#B89090" }}>{label}</span>
                            <span style={{
                              marginLeft: 8, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
                              background: active ? "#fdf0f0" : "#f0f0f0",
                              color: active ? "#C2877E" : "#B89090",
                            }}>{badge}</span>
                          </div>
                        </div>
                        <div style={{
                          width: 44, height: 24, borderRadius: 12, position: "relative",
                          background: active ? "#D29B9B" : "#e0d0d0", transition: "background 0.2s", flexShrink: 0,
                        }}>
                          <div style={{
                            position: "absolute", top: 3, left: active ? 23 : 3,
                            width: 18, height: 18, borderRadius: "50%", background: "#fff",
                            transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          }} />
                        </div>
                      </div>
                    );
                  })}
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

      {/* ===== Price Calculator Modal ===== */}
      {showPriceCalc && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24,
        }} onClick={() => setShowPriceCalc(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 24, padding: 32, maxWidth: 480, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease",
          }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🧮</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, color: "#3D2B2B", margin: "0 0 4px" }}>
                Calculadora de Preço
              </h2>
              <p style={{ color: "#9B7B7B", fontSize: 13, margin: 0 }}>
                Informe os dados do filamento para sugerir o preço de venda
              </p>
            </div>

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 5 }}>
                    Preço do filamento <span style={{ color: "#9B7B7B", fontWeight: 400 }}>(R$/kg)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9B7B7B", fontWeight: 700 }}>R$</span>
                    <input
                      type="number" step="0.01" min="0"
                      placeholder="100,00"
                      value={calcKgPrice}
                      onChange={e => setCalcKgPrice(e.target.value)}
                      style={{
                        width: "100%", padding: "11px 12px 11px 34px", borderRadius: 12, fontSize: 14,
                        border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                        outline: "none", boxSizing: "border-box", color: "#3D2B2B",
                      }}
                      onFocus={e => e.target.style.borderColor = '#D29B9B'}
                      onBlur={e => e.target.style.borderColor = '#f0e8e8'}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "#B89090", marginTop: 3, display: "block" }}>custo por quilo</span>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 5 }}>
                    Peso da peça <span style={{ color: "#9B7B7B", fontWeight: 400 }}>(gramas)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number" step="1" min="0"
                      placeholder="100"
                      value={calcGrams}
                      onChange={e => setCalcGrams(e.target.value)}
                      style={{
                        width: "100%", padding: "11px 36px 11px 12px", borderRadius: 12, fontSize: 14,
                        border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                        outline: "none", boxSizing: "border-box", color: "#3D2B2B",
                      }}
                      onFocus={e => e.target.style.borderColor = '#D29B9B'}
                      onBlur={e => e.target.style.borderColor = '#f0e8e8'}
                    />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#9B7B7B", fontWeight: 700 }}>g</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#B89090", marginTop: 3, display: "block" }}>quantidade de filamento</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 5 }}>
                    Custo operacional <span style={{ color: "#9B7B7B", fontWeight: 400 }}>(% sobre material)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number" step="1" min="0" max="200"
                      value={calcOverhead}
                      onChange={e => setCalcOverhead(e.target.value)}
                      style={{
                        width: "100%", padding: "11px 36px 11px 12px", borderRadius: 12, fontSize: 14,
                        border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                        outline: "none", boxSizing: "border-box", color: "#3D2B2B",
                      }}
                      onFocus={e => e.target.style.borderColor = '#D29B9B'}
                      onBlur={e => e.target.style.borderColor = '#f0e8e8'}
                    />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9B7B7B", fontWeight: 700 }}>%</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#B89090", marginTop: 3, display: "block" }}>energia, desgaste, tempo</span>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 5 }}>
                    Fator de lucro <span style={{ color: "#9B7B7B", fontWeight: 400 }}>(multiplicador)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number" step="0.1" min="1"
                      value={calcMultiplier}
                      onChange={e => setCalcMultiplier(e.target.value)}
                      style={{
                        width: "100%", padding: "11px 28px 11px 12px", borderRadius: 12, fontSize: 14,
                        border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                        outline: "none", boxSizing: "border-box", color: "#3D2B2B",
                      }}
                      onFocus={e => e.target.style.borderColor = '#D29B9B'}
                      onBlur={e => e.target.style.borderColor = '#f0e8e8'}
                    />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9B7B7B", fontWeight: 700 }}>×</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#B89090", marginTop: 3, display: "block" }}>3× = preço é 3x o custo</span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div style={{
              background: "#fdf9f9", border: "1px solid #f0e8e8", borderRadius: 16,
              padding: 18, marginBottom: 20,
            }}>
              {!calcReady ? (
                <p style={{ color: "#B89090", fontSize: 13, margin: 0, textAlign: "center" }}>
                  Preencha o preço do kg e o peso da peça para ver o cálculo
                </p>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A5A5A", marginBottom: 8 }}>
                    <span>Custo do material ({calcGrams}g)</span>
                    <span style={{ fontWeight: 700 }}>R$ {calcMaterial.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A5A5A", marginBottom: 8 }}>
                    <span>Custo operacional ({calcOverhead}%)</span>
                    <span style={{ fontWeight: 700 }}>R$ {(calcMaterial * calcOverhead / 100).toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A5A5A", paddingTop: 8, borderTop: "1px dashed #f0e8e8", marginBottom: 12 }}>
                    <span>Custo total</span>
                    <span style={{ fontWeight: 700 }}>R$ {calcTotalCost.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "linear-gradient(135deg, #fdf0f0, #f8f0f0)",
                    borderRadius: 12, padding: "12px 16px",
                    border: "2px solid #D29B9B",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B" }}>
                      💰 Preço sugerido ({calcMultiplier}×)
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#C2877E", fontFamily: "Nunito, sans-serif" }}>
                      R$ {calcSuggested.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Apply to which size */}
            {calcReady && form.sizePrices.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 6 }}>
                  Aplicar preço ao tamanho:
                </label>
                <select
                  value={calcTargetIdx}
                  onChange={e => setCalcTargetIdx(Number(e.target.value))}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14,
                    border: "2px solid #f0e8e8", fontFamily: "Nunito, sans-serif",
                    outline: "none", background: "#fdf9f9", color: "#3D2B2B",
                    boxSizing: "border-box",
                  }}
                >
                  {form.sizePrices.map((sp, i) => (
                    <option key={i} value={i}>
                      {sp.size ? sp.size : `Tamanho ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowPriceCalc(false)} style={{
                flex: 1, padding: "13px", borderRadius: 12, border: "2px solid #f0e8e8",
                background: "#fff", color: "#9B7B7B", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Nunito, sans-serif",
              }}>Cancelar</button>
              <button onClick={applyCalcPrice} disabled={!calcReady} style={{
                flex: 2, padding: "13px", borderRadius: 12, border: "none",
                background: calcReady ? "linear-gradient(135deg, #D29B9B, #C2877E)" : "#e8dada",
                color: calcReady ? "#fff" : "#B89090", fontSize: 14, fontWeight: 700,
                cursor: calcReady ? "pointer" : "not-allowed", fontFamily: "Nunito, sans-serif",
                boxShadow: calcReady ? "0 6px 16px rgba(194,135,126,0.35)" : "none",
              }}>
                ✅ Aplicar R$ {calcReady ? calcSuggested.toFixed(2).replace(".", ",") : "—"}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
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
          <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setView("orders")} style={{
            padding: "13px 22px", borderRadius: 14, border: "2px solid #f0e8e8",
            background: "#fff", color: "#7A5A5A", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Nunito, sans-serif",
            display: "flex", alignItems: "center", gap: 8,
          }}>📋 Pedidos</button>
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
                  <ProductImage productId={p.id} src={p.images?.[0]} size="thumb" />
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
