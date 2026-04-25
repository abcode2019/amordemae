// Product image component — exibe imagem real ou placeholder emoji
const ProductImage = ({ productId, src, index = 0, size = "full", className = "" }) => {
  // Se tiver URL de imagem real, exibe a foto
  if (src && typeof src === "string" && src.startsWith("http")) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        <img
          src={src}
          alt="Produto"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  // Fallback — placeholder visual com emoji
  const configs = {
    1: { icon: "🖼️", label: "porta-retrato família", bg: "#EDD5D5", accent: "#D29B9B" },
    2: { icon: "💡", label: "luminária nome 3D", bg: "#D5E5E3", accent: "#759B96" },
    3: { icon: "🌳", label: "árvore genealógica", bg: "#E8DDD5", accent: "#C2877E" },
    4: { icon: "🏦", label: "cofre personalizado", bg: "#EDD5D5", accent: "#D29B9B" },
    5: { icon: "🪆", label: "boneco personalizado", bg: "#D5E5E3", accent: "#759B96" },
    6: { icon: "📦", label: "caixinha de memórias", bg: "#E8DDD5", accent: "#C2877E" },
    7: { icon: "🏠", label: "placa de rua", bg: "#EDD5D5", accent: "#D29B9B" },
    8: { icon: "🔤", label: "quadro de letras 3D", bg: "#D5E5E3", accent: "#759B96" },
  };

  const defaultConfig = { icon: "📷", label: "sem imagem", bg: "#f0e8e8", accent: "#B89090" };
  const c = configs[productId] || defaultConfig;
  const stripeAngle = index % 2 === 0 ? "45deg" : "135deg";

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: c.bg,
        backgroundImage: `repeating-linear-gradient(${stripeAngle}, transparent, transparent 12px, ${c.accent}18 12px, ${c.accent}18 13px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: "inherit",
      }}
    >
      <span style={{ fontSize: size === "thumb" ? 28 : 48 }}>{c.icon}</span>
      <span style={{
        fontSize: size === "thumb" ? 9 : 11,
        color: c.accent,
        fontFamily: "monospace",
        textAlign: "center",
        padding: "0 12px",
        opacity: 0.8,
      }}>{c.label}</span>
    </div>
  );
};

Object.assign(window, { ProductImage });
