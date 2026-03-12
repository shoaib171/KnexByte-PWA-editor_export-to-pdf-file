import React from 'react';
import { Menu, Save, Sun, Moon } from 'lucide-react';


interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((old: boolean) => boolean)) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  title: string;
  onSave: () => void;
  onCreateNote: () => void;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  isDarkMode,
  setIsDarkMode,
  title,
  onSave
}: HeaderProps): React.JSX.Element => {
  return (
    <div style={{
      height: 52, background: "var(--kb-sidebar)", borderBottom: "1px solid var(--kb-border)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      flexShrink: 0
    }}>
      {isDarkMode ? <img src="/whiteLogo.png" alt="knexbyte-logo" style={{ height: 32 }} /> : <img src="/colorLogo.png" alt="knexbyte-logo" style={{ height: 32 }} />}
      <div style={{ width: 1, height: 24, background: "var(--kb-border)", margin: "0 4px" }} />
      <span style={{
        flex: 1, fontSize: 13, color: "var(--kb-text-muted)",
        fontFamily: "'DM Mono',monospace", letterSpacing: "0.3px"
      }}>
        {title}
      </span>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer",
            padding: 8, display: "flex", alignItems: "center", transition: "color 0.2s"
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ width: 1, height: 20, background: "var(--kb-border)" }} />

        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer", padding: 8
        }}><Menu size={18} /></button>
        <button onClick={onSave} style={{
          background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer", padding: 8
        }}><Save size={18} /></button>
      </div>
    </div>
  );
};

export default Header;
