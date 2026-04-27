// Landing Page
const Landing = ({ setPage, setSelectedProduct, products, favorites, toggleFavorite, addToCart }) => {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  const ValueCard = ({ icon, title, desc }) =>
    <div style={{
      background: "#fff", borderRadius: 20, padding: 28,
      boxShadow: "0 4px 24px rgba(210,155,155,0.1)",
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12,
      border: "1px solid #f8f0f0"
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 18,
        background: "linear-gradient(135deg, #fdf0f0, #f8eae8)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
      }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: 17, color: "#3D2B2B", fontFamily: "Playfair Display, serif" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: "#9B7B7B", lineHeight: 1.6 }}>{desc}</p>
    </div>;


  const TestimonialCard = ({ t }) =>
    <div style={{
      background: "#fff", borderRadius: 20, padding: 24,
      boxShadow: "0 4px 20px rgba(210,155,155,0.1)",
      border: "1px solid #f8f0f0", minWidth: 280, maxWidth: 320
    }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {[...Array(t.rating)].map((_, i) =>
          <span key={i} style={{ color: "#C2877E", fontSize: 14 }}>★</span>
        )}
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "#5A3F3F", lineHeight: 1.7, fontStyle: "italic" }}>
        "{t.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #D29B9B, #C2877E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 14, fontWeight: 700
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3D2B2B" }}>{t.name}</div>
          <div style={{ fontSize: 12, color: "#B89090" }}>{t.location}</div>
        </div>
      </div>
    </div>;


  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(160deg, #fdf9f9 0%, #faf4f2 50%, #f5eeec 100%)",
        position: "relative", overflow: "hidden", paddingTop: 68
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -100, right: -100, width: 500, height: 500,
          borderRadius: "50%", background: "radial-gradient(circle, #D29B9B18, transparent 70%)"
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80, width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, #759B9618, transparent 70%)"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", border: "1px solid #f0e8e8",
                borderRadius: 100, padding: "8px 16px", marginBottom: 24,
                fontSize: 13, color: "#C2877E", fontWeight: 700,
                boxShadow: "0 2px 12px rgba(194,135,126,0.15)"
              }}>
                ✨ Peças únicas, feitas com amor
              </div>
              <h1 style={{
                fontFamily: "Playfair Display, serif", fontSize: "clamp(36px, 5vw, 56px)",
                color: "#3D2B2B", lineHeight: 1.2, margin: "0 0 20px",
                fontWeight: 700
              }}>
                Transforme momentos com lembranças que duram para sempre
                <span style={{ color: "#D29B9B" }}> 💖</span>
              </h1>
              <p style={{ fontSize: 18, color: "#7A5A5A", lineHeight: 1.7, margin: "0 0 36px" }}>
                Peças personalizadas feitas com carinho para eternizar memórias
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setPage("catalog")} style={{
                  background: "linear-gradient(135deg, #D29B9B, #C2877E)",
                  border: "none", cursor: "pointer", padding: "16px 32px",
                  borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 700,
                  fontFamily: "Nunito, sans-serif",
                  boxShadow: "0 8px 24px rgba(194,135,126,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                  onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 32px rgba(194,135,126,0.5)"; }}
                  onMouseLeave={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 24px rgba(194,135,126,0.4)"; }}>
                  Ver catálogo</button>
                <button onClick={() => setPage("catalog")} style={{
                  background: "#fff", border: "2px solid #f0e8e8", cursor: "pointer",
                  padding: "16px 32px", borderRadius: 16, color: "#C2877E",
                  fontSize: 16, fontWeight: 700, fontFamily: "Nunito, sans-serif",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#D29B9B"; e.target.style.background = "#fdf8f8"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#f0e8e8"; e.target.style.background = "#fff"; }}>
                  ✨ Criar meu personalizado</button>
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
                {[["50+", "Peças entregues"], ["4.9★", "Avaliação média"], ["100%", "Feito com amor"]].map(([n, l]) =>
                  <div key={l}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#D29B9B", fontFamily: "Playfair Display, serif" }}>{n}</div>
                    <div style={{ fontSize: 12, color: "#9B7B7B", fontWeight: 600 }}>{l}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Hero visual */}
            <div style={{ position: "relative" }} className="hero-visual">
              <div style={{
                background: "linear-gradient(135deg, #fdf0f0, #f8eae8)",
                borderRadius: 32, aspectRatio: "1", display: "flex",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 24px 64px rgba(210,155,155,0.2)",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #D29B9B0A 20px, #D29B9B0A 21px)"
                }} />
                <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: 40 }}>
                  <div style={{ fontSize: 80 }}>🎁</div>
                  <div style={{ fontSize: 18, fontFamily: "Playfair Display, serif", color: "#3D2B2B", marginTop: 16, fontWeight: 700 }}>
                    Sua peça personalizada
                  </div>
                  <div style={{ fontSize: 13, color: "#9B7B7B", marginTop: 8, fontStyle: "italic" }}>
                    Feita com carinho, entregue com amor
                  </div>
                </div>
                {/* Floating badges */}
                {[
                  { top: 20, right: 20, text: "💖 Mais de 500 famílias" },
                  { bottom: 20, left: 20, text: "✨ Peça única" }].
                  map((b, i) =>
                    <div key={i} style={{
                      position: "absolute", top: b.top, right: b.right, bottom: b.bottom, left: b.left,
                      background: "#fff", borderRadius: 12, padding: "8px 14px",
                      fontSize: 12, fontWeight: 700, color: "#3D2B2B",
                      boxShadow: "0 4px 16px rgba(61,43,43,0.12)"
                    }}>{b.text}</div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section style={{ padding: "80px 24px", background: "#fdf9f9" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 12px" }}>
              Por que nos escolher?
            </h2>
            <p style={{ color: "#9B7B7B", fontSize: 16, margin: 0 }}>Cada detalhe pensado com amor para você</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="value-grid">
            <ValueCard icon="💝" title="Feito com amor" desc="Cada peça é produzida com atenção especial aos detalhes, garantindo que seu sentimento chegue intacto." />
            <ValueCard icon="✨" title="Personalizado para você" desc="Nomes, datas e mensagens especiais que tornam cada peça verdadeiramente única no mundo." />
            <ValueCard icon="🎁" title="Perfeito para presentear" desc="Embalagem especial e entrega cuidadosa para que o momento de receber seja tão emocionante quanto o de dar." />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 8px" }}>
                Peças que emocionam
              </h2>
              <p style={{ color: "#9B7B7B", fontSize: 16, margin: 0 }}>Os favoritos das nossas clientes</p>
            </div>
            <button onClick={() => setPage("catalog")} style={{
              background: "none", border: "2px solid #D29B9B", cursor: "pointer",
              padding: "10px 24px", borderRadius: 12, color: "#D29B9B",
              fontSize: 14, fontWeight: 700, fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s"
            }}>Ver todos →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="products-grid">
            {featured.map((p) =>
              <ProductCard key={p.id} product={p} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} setPage={setPage} setSelectedProduct={setSelectedProduct} />
            )}
          </div>
        </div>
      </section>

      {/* STORYTELLING */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(135deg, #3D2B2B 0%, #5A3F3F 100%)"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>💌</div>
          <h2 style={{
            fontFamily: "Playfair Display, serif", fontSize: "clamp(28px, 4vw, 44px)",
            color: "#fff", margin: "0 0 20px", lineHeight: 1.3
          }}>Cada peça conta uma história</h2>
          <p style={{ fontSize: 18, color: "#D29B9B", lineHeight: 1.8, margin: "0 0 40px", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Você não está comprando um produto. Você está criando uma lembrança que sua família vai guardar para sempre — e que vai contar a história do amor que existe aí.
          </p>
          <button onClick={() => setPage("catalog")} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "18px 40px",
            borderRadius: 16, color: "#fff", fontSize: 17, fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 8px 32px rgba(194,135,126,0.5)"
          }}>💖 Quero criar uma lembrança única</button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 24px", background: "#fdf9f9", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 12px" }}>
              O que dizem as mamães
            </h2>
            <p style={{ color: "#9B7B7B", fontSize: 16, margin: 0 }}>Histórias reais de quem recebeu com o coração cheio</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="testimonials-grid">
            {MOCK_TESTIMONIALS.map((t) => <TestimonialCard key={t.id} t={t} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🌸</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "#3D2B2B", margin: "0 0 16px" }}>
            Pronta para criar algo especial?
          </h2>
          <p style={{ color: "#9B7B7B", fontSize: 16, margin: "0 0 36px", lineHeight: 1.7 }}>
            Cada pedido é feito com cuidado e amor. Converse com a gente pelo WhatsApp e vamos criar juntas a peça perfeita para você.
          </p>
          <button onClick={() => setPage("catalog")} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "18px 48px",
            borderRadius: 16, color: "#fff", fontSize: 18, fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 8px 32px rgba(194,135,126,0.4)",
            transition: "all 0.2s"
          }}>✨ Ver o catálogo completo</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#3D2B2B", color: "#D29B9B",
        padding: "40px 24px", textAlign: "center"
      }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, marginBottom: 8 }}>Amor de Mãe 3D</div>
        <div style={{ fontSize: 13, color: "#9B7B7B", marginBottom: 16 }}>Peças personalizadas feitas com carinho 💖</div>
        <div style={{ fontSize: 12, color: "#6B5050" }}>© 2025 Amor de Mãe 3D. Feito com muito amor.</div>
      </footer>
    </div>);

};

Object.assign(window, { Landing });
