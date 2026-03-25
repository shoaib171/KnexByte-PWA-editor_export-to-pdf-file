import { memo } from 'react';
import { Menu, FileDown } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((old: boolean) => boolean)) => void;
  title: string;
  onDownloadPDF: () => void;
}

const Header = memo(({ sidebarOpen, setSidebarOpen, title, onDownloadPDF }: HeaderProps) => {
  return (
    <div style={{
      height: 52, background: "var(--kb-sidebar)", borderBottom: "1px solid var(--kb-border)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0
    }}>
      <img src="/whiteLogo.png" alt="knexbyte-logo" style={{ height: 32 }} />
      <div style={{ width: 1, height: 24, background: "var(--kb-border)", margin: "0 4px" }} />
      <span style={{
        flex: 1, fontSize: 13, color: "var(--kb-text-muted)",
        fontFamily: "'DM Mono',monospace", letterSpacing: "0.3px"
      }}>
        {title}
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          style={{ background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer", padding: 8 }}
        >
          <Menu size={18} />
        </button>
        <button
          onClick={onDownloadPDF}
          title="Download as PDF (Ctrl+S)"
          style={{ background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer", padding: 8 }}
        >
          <FileDown size={18} />
        </button>
      </div>
    </div>
  );
});

export default Header;
