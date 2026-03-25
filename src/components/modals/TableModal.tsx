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
  const clampRows = (v: number) => setTableRows(Math.max(1, Math.min(20, v)));
  const clampCols = (v: number) => setTableCols(Math.max(1, Math.min(10, v)));

  const previewRows = Math.min(tableRows + 1, 6); // +1 for header
  const previewCols = Math.min(tableCols, 6);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{
        background: "var(--kb-card-bg)", border: "1px solid var(--kb-border)", borderRadius: 14,
        padding: 24, width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <TableIcon size={18} color="var(--kb-blue)" />
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--kb-text)" }}>Insert Table</h3>
        </div>

        {/* Row / Col inputs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "var(--kb-text-muted)", fontFamily: "'DM Mono',monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>Rows</div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--kb-border)", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => clampRows(tableRows - 1)} style={{ width: 32, height: 34, background: "var(--kb-item-hover)", border: "none", color: "var(--kb-text)", fontSize: 16, cursor: "pointer" }}>−</button>
              <input
                type="number" value={tableRows}
                onChange={e => clampRows(+e.target.value)}
                min={1} max={20}
                style={{ flex: 1, height: 34, background: "var(--kb-item-hover)", border: "none", borderLeft: "1px solid var(--kb-border)", borderRight: "1px solid var(--kb-border)", color: "var(--kb-text)", fontSize: 14, textAlign: "center", outline: "none", fontFamily: "'DM Mono',monospace" }}
              />
              <button onClick={() => clampRows(tableRows + 1)} style={{ width: 32, height: 34, background: "var(--kb-item-hover)", border: "none", color: "var(--kb-text)", fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
          </label>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "var(--kb-text-muted)", fontFamily: "'DM Mono',monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>Columns</div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--kb-border)", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => clampCols(tableCols - 1)} style={{ width: 32, height: 34, background: "var(--kb-item-hover)", border: "none", color: "var(--kb-text)", fontSize: 16, cursor: "pointer" }}>−</button>
              <input
                type="number" value={tableCols}
                onChange={e => clampCols(+e.target.value)}
                min={1} max={10}
                style={{ flex: 1, height: 34, background: "var(--kb-item-hover)", border: "none", borderLeft: "1px solid var(--kb-border)", borderRight: "1px solid var(--kb-border)", color: "var(--kb-text)", fontSize: 14, textAlign: "center", outline: "none", fontFamily: "'DM Mono',monospace" }}
              />
              <button onClick={() => clampCols(tableCols + 1)} style={{ width: 32, height: 34, background: "var(--kb-item-hover)", border: "none", color: "var(--kb-text)", fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
          </label>
        </div>

        {/* Grid preview */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "var(--kb-text-muted)", fontFamily: "'DM Mono',monospace", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Preview {tableRows > 5 || tableCols > 6 ? `(${tableRows}×${tableCols}, showing partial)` : ""}
          </div>
          <div style={{ border: "1px solid var(--kb-border)", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {Array.from({ length: previewCols }).map((_, c) => (
                    <th key={c} style={{
                      background: "#1e2a3a", padding: "7px 10px", border: "1px solid #ffffff50",
                      fontWeight: 700, color: "#e6edf3", textAlign: "left"
                    }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: previewRows - 1 }).map((_, r) => (
                  <tr key={r}>
                    {Array.from({ length: previewCols }).map((_, c) => (
                      <td key={c} style={{
                        padding: "6px 10px", border: "1px solid #ffffff30", color: "#8b949e",
                        background: r % 2 === 0 ? "#0d1117" : "#111820"
                      }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", border: "1px solid var(--kb-border)", borderRadius: 8, color: "var(--kb-text-muted)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onSubmit} style={{ padding: "7px 20px", background: "var(--kb-blue)", border: "none", borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Insert</button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;
