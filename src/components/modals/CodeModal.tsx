import React from 'react';
import { Terminal } from 'lucide-react';
import { LANGUAGES } from '../../constants';

interface CodeModalProps {
  codeLang: string;
  setCodeLang: (v: string) => void;
  codeContent: string;
  setCodeContent: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const CodeModal = ({
  codeLang, setCodeLang, codeContent, setCodeContent, onSubmit, onClose
}: CodeModalProps): React.JSX.Element => {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{
        background: "var(--kb-card-bg)", border: "1px solid var(--kb-border)", borderRadius: 14,
        padding: 24, width: 440,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Terminal size={18} color="var(--kb-blue)" />
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--kb-text)" }}>Insert Code Block</h3>
        </div>
        <label style={{ display: "block", fontSize: 11, color: "var(--kb-text-muted)", marginBottom: 4, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Language</label>
        <select value={codeLang} onChange={e => setCodeLang(e.target.value)} style={{
          width: "100%", background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 8,
          padding: "8px 12px", color: "var(--kb-text)", fontSize: 13, outline: "none", marginBottom: 12,
          fontFamily: "'DM Mono',monospace"
        }}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <textarea value={codeContent} onChange={e => setCodeContent(e.target.value)}
          placeholder="// Paste your code here…"
          style={{
            width: "100%", background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 8,
            padding: "12px", color: "var(--kb-text)", fontSize: 13, outline: "none",
            fontFamily: "'DM Mono',monospace", minHeight: 140, resize: "vertical", marginBottom: 16,
            lineHeight: 1.6
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", border: "1px solid var(--kb-border)", borderRadius: 8, color: "var(--kb-text-muted)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onSubmit} style={{ padding: "7px 16px", background: "var(--kb-blue)", border: "none", borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Insert Block</button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
