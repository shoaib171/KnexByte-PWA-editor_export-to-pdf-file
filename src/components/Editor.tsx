import React from 'react';

interface EditorProps {
  onInput: () => void;
  editorFont: string;
}

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(({ onInput, editorFont }, ref) => {
  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "48px 0",
      display: "flex", justifyContent: "center",
      background: "var(--kb-bg)"
    }}>
      <div style={{ width: "100%", maxWidth: 1200, padding: "0 10px" }}>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const sel = window.getSelection();
              const cell = sel?.rangeCount
                ? (sel.getRangeAt(0).startContainer as Element).closest?.('td, th') ??
                  (sel.getRangeAt(0).startContainer.parentElement?.closest('td, th'))
                : null;

              if (cell) {
                const table = cell.closest('table');
                const cells = Array.from(table?.querySelectorAll('td, th') ?? []);
                const idx = cells.indexOf(cell as HTMLElement);

                if (idx < cells.length - 1) {
                  // move to next cell
                  const next = cells[idx + 1] as HTMLElement;
                  const r = document.createRange();
                  r.selectNodeContents(next);
                  r.collapse(false);
                  sel!.removeAllRanges();
                  sel!.addRange(r);
                } else {
                  // last cell — append a new row
                  const tbody = table?.querySelector('tbody');
                  const lastRow = tbody?.lastElementChild as HTMLTableRowElement | null;
                  if (tbody && lastRow) {
                    const colCount = lastRow.cells.length;
                    const isEven = tbody.rows.length % 2 === 0;
                    const newRow = document.createElement('tr');
                    for (let c = 0; c < colCount; c++) {
                      const td = document.createElement('td');
                      td.style.cssText = `padding:10px 16px;border:1px solid #ffffff30;color:#c9d1d9;min-width:100px;background:${isEven ? '#0d1117' : '#111820'};`;
                      td.innerHTML = '<br>';
                      newRow.appendChild(td);
                    }
                    tbody.appendChild(newRow);
                    const firstTd = newRow.firstElementChild as HTMLElement;
                    const r = document.createRange();
                    r.selectNodeContents(firstTd);
                    r.collapse(true);
                    sel!.removeAllRanges();
                    sel!.addRange(r);
                    onInput();
                  }
                }
              } else {
                document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
              }
            }
          }}
          spellCheck
          style={{
            outline: "none", minHeight: 600,
            fontSize: "15.5px", lineHeight: "1.8", color: "var(--kb-text)",
            caretColor: "var(--kb-blue)",
            fontFamily: editorFont,
            width: "100%"
          }}
        />
      </div>
    </div>
  );
});

export default Editor;
