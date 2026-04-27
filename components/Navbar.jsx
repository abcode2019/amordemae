// Navbar component
const Navbar = ({ page, setPage, cartCount, favCount, onLogoClick, isAdmin, onAdminClick }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "landing", label: "Início" },
    { id: "catalog", label: "Catálogo" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || menuOpen ? "rgba(253,249,249,0.97)" : "rgba(253,249,249,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled ? "1px solid #f0e8e8" : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68,
      }}>
        {/* Logo */}
        <button onClick={() => { setPage("landing"); setMenuOpen(false); if (onLogoClick) onLogoClick(); }} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", flexDirection: "column", alignItems: "flex-start",
        }}>
          <span style={{
            fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700,
            color: "#D29B9B", lineHeight: 1, letterSpacing: "-0.5px",
          }}>Amor de Mãe</span>
          <span style={{ fontSize: 10, color: "#C2877E", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase" }}>
            3D Personalizados
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 15, fontWeight: page === l.id ? 700 : 600,
              color: page === l.id ? "#D29B9B" : "#9B7B7B",
              fontFamily: "Nunito, sans-serif",
              paddingBottom: 2,
              borderBottom: page === l.id ? "2px solid #D29B9B" : "2px solid transparent",
              transition: "all 0.2s",
            }}>{l.label}</button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Admin button — visible only when logged in */}
          {isAdmin && (
            <button onClick={onAdminClick} title="Painel Admin" style={{
              background: "#3D2B2B", border: "none", cursor: "pointer",
              width: 44, height: 44, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(61,43,43,0.25)",
            }}>🔐</button>
          )}

          {/* Instagram */}
          <a
            href="https://www.instagram.com/amordemae3d/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @amordemae3d"
            style={{
              width: 44, height: 44, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", textDecoration: "none", flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fdf0f0"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433"/>
                  <stop offset="25%" stopColor="#e6683c"/>
                  <stop offset="50%" stopColor="#dc2743"/>
                  <stop offset="75%" stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad)" stroke="none"/>
            </svg>
          </a>

          {/* Favorites */}
          <button onClick={() => setPage("favorites")} style={{
            background: page === "favorites" ? "#fdf0f0" : "none",
            border: "none", cursor: "pointer", position: "relative",
            width: 44, height: 44, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={page === "favorites" ? "#D29B9B" : "none"} stroke="#D29B9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                background: "#D29B9B", color: "#fff",
                fontSize: 9, fontWeight: 800, width: 16, height: 16,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{favCount}</span>
            )}
          </button>

          {/* Cart */}
          <button onClick={() => setPage("cart")} style={{
            background: page === "cart" ? "#fdf0f0" : "none",
            border: "none", cursor: "pointer", position: "relative",
            width: 44, height: 44, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2877E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                background: "#C2877E", color: "#fff",
                fontSize: 9, fontWeight: 800, width: 16, height: 16,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount}</span>
            )}
          </button>

          {/* CTA button */}
          <button onClick={() => setPage("catalog")} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "10px 20px",
            borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 12px rgba(194,135,126,0.35)",
            display: "none",
          }} className="cta-nav">Ver Catálogo</button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(m => !m)} style={{
            background: "none", border: "none", cursor: "pointer",
            width: 44, height: 44, borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
          }} className="hamburger">
            <span style={{ width: 22, height: 2, background: "#3D2B2B", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: 22, height: 2, background: "#3D2B2B", borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: "#3D2B2B", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          padding: "16px 0 24px",
          borderTop: "1px solid #f0e8e8",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }} style={{
              background: page === l.id ? "#fdf0f0" : "none",
              border: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 700,
              color: page === l.id ? "#D29B9B" : "#3D2B2B",
              fontFamily: "Nunito, sans-serif",
              padding: "14px 16px", borderRadius: 12, textAlign: "left",
            }}>{l.label}</button>
          ))}
          <a
            href="https://www.instagram.com/amordemae3d/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px", borderRadius: 12, textDecoration: "none",
              fontSize: 15, fontWeight: 700, color: "#cc2366",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @amordemae3d
          </a>
          <button onClick={() => { setPage("catalog"); setMenuOpen(false); }} style={{
            background: "linear-gradient(135deg, #D29B9B, #C2877E)",
            border: "none", cursor: "pointer", padding: "14px 16px",
            borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
            fontFamily: "Nunito, sans-serif", marginTop: 8, textAlign: "center",
          }}>✨ Criar meu personalizado</button>
        </div>
      )}
    </nav>
  );
};

Object.assign(window, { Navbar });
