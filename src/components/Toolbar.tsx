import React, { memo } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Minus,
  Code, Table as TableIcon, Undo, Redo,
  Search, Printer
} from 'lucide-react';
import { KB_BLUE, FONT_OPTIONS, FONT_SIZES } from '../constants';

interface IconBtnProps {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

const IconBtn = memo(({ title, onClick, active, children }: IconBtnProps) => {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: 30, height: 30, border: "none", borderRadius: 7, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6px", fontSize: 12, fontWeight: 600, gap: 3, transition: "all 0.15s",
        background: active ? "var(--kb-blue)20" : hov ? "var(--kb-item-hover)" : "transparent",
        color: active ? "var(--kb-blue)" : hov ? "var(--kb-text)" : "var(--kb-text-muted)",
        outline: active ? "1px solid var(--kb-blue)40" : "none"
      }}
    >
      {children}
    </button>
  );
});

const Sep = memo(() => (
  <div style={{ width: 1, height: 20, background: "var(--kb-border)", margin: "0 4px", flexShrink: 0 }} />
));

interface ToolbarProps {
  onCmd: (command: string, value?: string) => void;
  onInsertHTML: (html: string) => void;
  onShowCode: () => void;
  onShowTable: () => void;
  onShowFind: () => void;
  findActive: boolean;
  editorFont: string;
  onFontChange: (font: string) => void;
}

const Toolbar = memo(({
  onCmd, onInsertHTML, onShowCode, onShowTable, onShowFind, findActive, editorFont, onFontChange
}: ToolbarProps) => {
  return (
    <div style={{
      background: "var(--kb-sidebar)", borderBottom: "1px solid var(--kb-border)",
      padding: "6px 14px", display: "flex", alignItems: "center",
      gap: 2, flexWrap: "wrap", minHeight: 46, flexShrink: 0
    }}>
      <select
        value={editorFont}
        onChange={e => onFontChange(e.target.value)}
        style={{
          height: 28, background: "var(--kb-item-hover)", color: "var(--kb-text-muted)",
          border: "1px solid var(--kb-border)", borderRadius: 7, padding: "0 8px",
          fontSize: 11.5, cursor: "pointer", outline: "none",
          fontFamily: "system-ui,sans-serif", maxWidth: 148
        }}
      >
        {FONT_OPTIONS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        onChange={e => {
          onCmd("fontSize", "7");
          document.querySelectorAll('[contenteditable] font[size="7"]').forEach(el => {
            const fontEl = el as HTMLElement;
            fontEl.removeAttribute("size");
            fontEl.style.fontSize = e.target.value + "px";
          });
        }}
        defaultValue={14}
        style={{
          height: 28, background: "var(--kb-item-hover)", color: "var(--kb-text-muted)",
          border: "1px solid var(--kb-border)", borderRadius: 7, padding: "0 8px",
          fontSize: 11.5, cursor: "pointer", outline: "none", fontFamily: "'DM Mono',monospace",
          width: 56
        }}
      >
        {FONT_SIZES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <Sep />
      <IconBtn title="Bold" onClick={() => onCmd("bold")}><Bold size={14} /></IconBtn>
      <IconBtn title="Italic" onClick={() => onCmd("italic")}><Italic size={14} /></IconBtn>
      <IconBtn title="Underline" onClick={() => onCmd("underline")}><Underline size={14} /></IconBtn>
      <IconBtn title="Strikethrough" onClick={() => onCmd("strikeThrough")}><Strikethrough size={14} /></IconBtn>

      <Sep />
      <IconBtn title="Align Left" onClick={() => onCmd("justifyLeft")}><AlignLeft size={14} /></IconBtn>
      <IconBtn title="Center" onClick={() => onCmd("justifyCenter")}><AlignCenter size={14} /></IconBtn>
      <IconBtn title="Align Right" onClick={() => onCmd("justifyRight")}><AlignRight size={14} /></IconBtn>

      <Sep />
      <IconBtn title="Bullet List" onClick={() => onCmd("insertUnorderedList")}><List size={14} /></IconBtn>
      <IconBtn title="Numbered List" onClick={() => onCmd("insertOrderedList")}><ListOrdered size={14} /></IconBtn>

      <Sep />
      <IconBtn title="Blockquote" onClick={() => onCmd("formatBlock", "blockquote")}><Quote size={14} /></IconBtn>
      <IconBtn title="Divider" onClick={() => onInsertHTML('<hr style="border:none;border-top:1px solid var(--kb-border);margin:20px 0;"><p></p>')}><Minus size={14} /></IconBtn>
      <IconBtn title="Code Block" onClick={onShowCode}><Code size={14} /></IconBtn>
      <IconBtn title="Table" onClick={onShowTable}><TableIcon size={14} /></IconBtn>

      <Sep />
      <input type="color" defaultValue={KB_BLUE}
        onChange={e => onCmd("foreColor", e.target.value)}
        style={{ width: 28, height: 28, border: "1px solid var(--kb-border)", background: "transparent", cursor: "pointer", borderRadius: 7, padding: 2 }}
      />
      <input type="color" defaultValue="#1a9fd430"
        onChange={e => onCmd("hiliteColor", e.target.value)}
        style={{ width: 28, height: 28, border: "1px solid var(--kb-border)", background: "transparent", cursor: "pointer", borderRadius: 7, padding: 2 }}
      />

      <Sep />
      <IconBtn title="Undo" onClick={() => onCmd("undo")}><Undo size={14} /></IconBtn>
      <IconBtn title="Redo" onClick={() => onCmd("redo")}><Redo size={14} /></IconBtn>

      <Sep />
      <IconBtn title="Find & Replace (Ctrl+F)" onClick={onShowFind} active={findActive}><Search size={14} /></IconBtn>
      <IconBtn title="Print" onClick={() => window.print()}><Printer size={14} /></IconBtn>
    </div>
  );
});

export default Toolbar;
