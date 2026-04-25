// Admin Login Page — Supabase Auth
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await db.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const messages = {
          "Invalid login credentials": "E-mail ou senha incorretos.",
          "Email not confirmed": "E-mail não confirmado. Verifique sua caixa de entrada.",
        };
        setError(messages[authError.message] || authError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        onLogin();
      }
    } catch (err) {
      setError("Erro ao conectar. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #fdf9f9 0%, #f5eeec 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, color: "#3D2B2B", margin: "0 0 6px" }}>
            Painel Administrativo
          </h1>
          <p style={{ color: "#9B7B7B", fontSize: 14, margin: 0 }}>Amor de Mãe 3D</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "#fff", borderRadius: 24, padding: 36,
          boxShadow: "0 12px 48px rgba(210,155,155,0.15)",
          border: "1px solid #f0e8e8",
        }}>
          {/* E-mail */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@amordemae.com"
              autoFocus
              style={{
                width: "100%", padding: "14px 16px",
                borderRadius: 14, fontSize: 15, fontFamily: "Nunito, sans-serif",
                border: error ? "2px solid #C2877E" : "2px solid #f0e8e8",
                outline: "none", boxSizing: "border-box",
                background: "#fdf9f9", color: "#3D2B2B",
                transition: "border 0.2s",
              }}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3D2B2B", display: "block", marginBottom: 8 }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Digite a senha…"
                style={{
                  width: "100%", padding: "14px 48px 14px 16px",
                  borderRadius: 14, fontSize: 15, fontFamily: "Nunito, sans-serif",
                  border: error ? "2px solid #C2877E" : "2px solid #f0e8e8",
                  outline: "none", boxSizing: "border-box",
                  background: "#fdf9f9", color: "#3D2B2B",
                  transition: "border 0.2s",
                }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#B89090", fontSize: 18, padding: 0,
                display: "flex", alignItems: "center",
              }}>{showPass ? "🙈" : "👁️"}</button>
            </div>
            {error && (
              <p style={{ fontSize: 13, color: "#C2877E", margin: "8px 0 0", fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading || !email || !password} style={{
            width: "100%", padding: "15px",
            borderRadius: 14, border: "none",
            background: loading || !email || !password
              ? "#e8dada"
              : "linear-gradient(135deg, #D29B9B, #C2877E)",
            color: loading || !email || !password ? "#B89090" : "#fff",
            fontSize: 16, fontWeight: 700, cursor: loading || !email || !password ? "not-allowed" : "pointer",
            fontFamily: "Nunito, sans-serif",
            boxShadow: loading || !email || !password ? "none" : "0 6px 20px rgba(194,135,126,0.4)",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⏳</span>
                Autenticando…
              </>
            ) : "Entrar no Painel"}
          </button>

          <p style={{ fontSize: 12, color: "#B89090", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            🔒 Acesso restrito a administradores.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent("amordemae:goto", { detail: "landing" }))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9B7B7B", fontSize: 14, fontFamily: "Nunito, sans-serif" }}>
            ← Voltar à loja
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

Object.assign(window, { AdminLogin });
