import { useState, useRef, useCallback } from 'react';

export function useInsertContent(insertHTML: (html: string) => void) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [codeLang, setCodeLang] = useState("javascript");
  const [codeContent, setCodeContent] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Latest-value refs so insertCodeBlock/insertTable stay stable
  const codeLangRef = useRef(codeLang);
  codeLangRef.current = codeLang;
  const codeContentRef = useRef(codeContent);
  codeContentRef.current = codeContent;
  const tableRowsRef = useRef(tableRows);
  tableRowsRef.current = tableRows;
  const tableColsRef = useRef(tableCols);
  tableColsRef.current = tableCols;

  const insertCodeBlock = useCallback(() => {
    if (!codeContentRef.current.trim()) { setShowCodeModal(false); return; }
    const escaped = codeContentRef.current.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<div class="kb-code-block" contenteditable="false" style="margin:16px 0;border-radius:10px;overflow:hidden;border:1px solid #30363d;">
<div style="background:#161b22;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #21262d;">
<span style="font-size:10px;color:#1a9fd4;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${codeLangRef.current}</span>
<span style="font-size:10px;color:#4a5568;">// KnexByte Systems</span>
</div>
<pre style="margin:0;padding:16px;background:#0d1117;overflow-x:auto;"><code style="font-family:'DM Mono',monospace;font-size:13px;color:#e6edf3;line-height:1.7;">${escaped}</code></pre>
</div><p></p>`;
    insertHTML(html);
    setShowCodeModal(false);
    setCodeContent("");
  }, [insertHTML]);

  const insertTable = useCallback(() => {
    const rows = tableRowsRef.current;
    const cols = tableColsRef.current;
    let html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px;border:2px solid #ffffff40;"><thead><tr>`;
    for (let c = 0; c < cols; c++)
      html += `<th style="background:#1e2a3a;padding:11px 16px;text-align:left;font-weight:700;color:#e6edf3;border:1px solid #ffffff50;min-width:100px;font-size:13px;"><br></th>`;
    html += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      const bg = r % 2 === 0 ? "#0d1117" : "#111820";
      html += `<tr>`;
      for (let c = 0; c < cols; c++)
        html += `<td style="padding:10px 16px;border:1px solid #ffffff30;color:#c9d1d9;min-width:100px;background:${bg};"><br></td>`;
      html += `</tr>`;
    }
    html += `</tbody></table><p></p>`;
    insertHTML(html);
    setShowTableModal(false);
  }, [insertHTML]);

  return {
    showCodeModal, setShowCodeModal,
    showTableModal, setShowTableModal,
    codeLang, setCodeLang,
    codeContent, setCodeContent,
    tableRows, setTableRows,
    tableCols, setTableCols,
    insertCodeBlock,
    insertTable,
  };
}
