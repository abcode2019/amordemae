// Toast notification system
const Toast = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#759B96" : t.type === "error" ? "#C2877E" : "#D29B9B",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 16,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideInRight 0.3s ease",
          maxWidth: 300,
        }}>
          <span>{t.icon || "💖"}</span>
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{
            background: "none", border: "none", color: "#fff",
            cursor: "pointer", fontSize: 16, padding: 0, marginLeft: 4, opacity: 0.8,
          }}>×</button>
        </div>
      ))}
    </div>
  );
};

// Skeleton loader
const Skeleton = ({ width = "100%", height = 20, radius = 8, style = {} }) => (
  <div style={{
    width, height, borderRadius: radius,
    background: "linear-gradient(90deg, #f0e8e8 25%, #f8f2f2 50%, #f0e8e8 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    ...style
  }} />
);

const ProductCardSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 20, overflow: "hidden",
    boxShadow: "0 4px 20px rgba(210,155,155,0.12)",
  }}>
    <Skeleton height={220} radius={0} />
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton height={18} width="70%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="60%" />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Skeleton height={38} radius={12} style={{ flex: 1 }} />
        <Skeleton height={38} width={38} radius={12} />
      </div>
    </div>
  </div>
);

Object.assign(window, { Toast, Skeleton, ProductCardSkeleton });
