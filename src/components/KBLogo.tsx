const KBLogo = ({ height = 34 }: { height?: number }) => {
  const logoBlue = "#00AEEF";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", height, userSelect: "none" }}>
      <svg 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        style={{ flexShrink: 0 }}
      >
        <circle cx="20" cy="20" r="12" fill="#00AEEF" />
        <circle cx="20" cy="80" r="12" fill="#1C3D5A" />
        <path 
          d="M65 15L30 50L65 85" 
          stroke="#00AEEF" 
          strokeWidth="16" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M65 15C85 15 95 25 95 40C95 50 85 60 75 60M65 85C85 85 95 75 95 60C95 50 85 40 75 40" 
          stroke="#1C3D5A" 
          strokeWidth="16" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 0.85, paddingTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <span style={{ 
            fontSize: height * 0.9, 
            fontWeight: 800, 
            color: "transparent", 
            WebkitTextStroke: "1px var(--kb-text)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.5px"
          }}>KNEX</span>
          <span style={{ 
            fontSize: height * 0.9, 
            fontWeight: 800, 
            color: logoBlue, 
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.5px"
          }}>BYTE</span>
        </div>
        <div style={{ 
          fontSize: height * 0.45, 
          fontWeight: 400, 
          color: "transparent", 
          WebkitTextStroke: "0.5px var(--kb-text-muted)",
          alignSelf: "flex-end",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "1.5px",
          marginTop: -2,
          opacity: 0.7
        }}>
          systems
        </div>
      </div>
    </div>
  );
};

export default KBLogo;
