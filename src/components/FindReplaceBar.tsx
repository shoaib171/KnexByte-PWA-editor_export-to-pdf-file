import React from 'react';
import { X } from 'lucide-react';

interface FindReplaceBarProps {
  findVal: string;
  setFindVal: (val: string) => void;
  replaceVal: string;
  setReplaceVal: (val: string) => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  onClose: () => void;
}

const FindReplaceBar = ({ 
  findVal, setFindVal, replaceVal, setReplaceVal, onReplace, onReplaceAll, onClose 
}: FindReplaceBarProps): React.JSX.Element => {
  return (
    <div style={{
      background: "var(--kb-sidebar)", borderBottom: "1px solid var(--kb-border)",
      padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0
    }}>
      <input value={findVal} onChange={e => setFindVal(e.target.value)}
        placeholder="Find…"
        style={{
          height: 28, background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 7,
          padding: "0 10px", color: "var(--kb-text)", fontSize: 12.5, outline: "none",
          fontFamily: "'DM Mono',monospace", width: 200
        }}
      />
      <input value={replaceVal} onChange={e => setReplaceVal(e.target.value)}
        placeholder="Replace…"
        style={{
          height: 28, background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 7,
          padding: "0 10px", color: "var(--kb-text)", fontSize: 12.5, outline: "none",
          fontFamily: "'DM Mono',monospace", width: 180
        }}
      />
      <button onClick={onReplace} style={{ height: 26, padding: "0 10px", background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", color: "var(--kb-text-muted)", borderRadius: 6, fontSize: 11.5, cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>Replace</button>
      <button onClick={onReplaceAll} style={{ height: 26, padding: "0 10px", background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", color: "var(--kb-text-muted)", borderRadius: 6, fontSize: 11.5, cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>All</button>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "var(--kb-text-muted)", cursor: "pointer" }}><X size={16} /></button>
    </div>
  );
};

export default FindReplaceBar;
