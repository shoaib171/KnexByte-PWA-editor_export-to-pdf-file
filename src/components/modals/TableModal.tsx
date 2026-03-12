import React from 'react';
import { Table as TableIcon } from 'lucide-react';

interface TableModalProps {
  tableRows: number;
  setTableRows: (n: number) => void;
  tableCols: number;
  setTableCols: (n: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const TableModal = ({
  tableRows, setTableRows, tableCols, setTableCols, onSubmit, onClose
}: TableModalProps): React.JSX.Element => {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{
        background: "var(--kb-card-bg)", border: "1px solid var(--kb-border)", borderRadius: 14,
        padding: 24, width: 340,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TableIcon size={18} color="var(--kb-blue)" />
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--kb-text)" }}>Insert Table</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <input type="number" value={tableRows} onChange={e => setTableRows(+e.target.value)} min={1} max={20}
            style={{ width: 60, height: 34, background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 8, padding: "0 8px", color: "var(--kb-text)", fontSize: 14, textAlign: "center", outline: "none", fontFamily: "'DM Mono',monospace" }}
          />
          <span style={{ fontSize: 12, color: "var(--kb-text-muted)", fontFamily: "'DM Mono',monospace" }}>rows ×</span>
          <input type="number" value={tableCols} onChange={e => setTableCols(+e.target.value)} min={1} max={10}
            style={{ width: 60, height: 34, background: "var(--kb-item-hover)", border: "1px solid var(--kb-border)", borderRadius: 8, padding: "0 8px", color: "var(--kb-text)", fontSize: 14, textAlign: "center", outline: "none", fontFamily: "'DM Mono',monospace" }}
          />
          <span style={{ fontSize: 12, color: "var(--kb-text-muted)", fontFamily: "'DM Mono',monospace" }}>cols</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", border: "1px solid var(--kb-border)", borderRadius: 8, color: "var(--kb-text-muted)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onSubmit} style={{ padding: "7px 16px", background: "var(--kb-blue)", border: "none", borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Insert</button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;
