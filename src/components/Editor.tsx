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
              document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;"); 
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
