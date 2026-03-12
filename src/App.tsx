import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import FindReplaceBar from './components/FindReplaceBar';
import Editor from './components/Editor';
import CodeModal from './components/modals/CodeModal';
import TableModal from './components/modals/TableModal';
import { Note, SaveStatus } from './types';
import { DEFAULT_FONT } from './constants';
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem("kb-theme") !== "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem("kb-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const editorRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("kb-notes") || "[]");
    } catch { return []; }
  });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showFind, setShowFind] = useState(false);
  
  const [codeLang, setCodeLang] = useState("javascript");
  const [codeContent, setCodeContent] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [findVal, setFindVal] = useState("");
  const [replaceVal, setReplaceVal] = useState("");
  const [editorFont, setEditorFont] = useState(DEFAULT_FONT);
  
  const saveTimer = useRef<number | null>(null);

  const createNote = useCallback(() => {
    const note: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "<p></p>",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };
    setNotes(prev => {
      const next = [note, ...prev];
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    setCurrentId(note.id);
    if (editorRef.current) editorRef.current.innerHTML = "<p></p>";
    updateStats("");
  }, []);

  const autoSave = useCallback((silent = false) => {
    if (!currentId || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || "";
    const title = text.trim().split("\n")[0]?.slice(0, 40) || "Untitled Note";
    setNotes(prev => {
      const next = prev.map(n => n.id === currentId ? { ...n, content, title } : n);
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    if (!silent) setSaveStatus("saved");
  }, [currentId]);

  const loadNote = useCallback((id: string) => {
    autoSave(true);
    setCurrentId(id);
    const note = notes.find(n => n.id === id);
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content || "<p></p>";
      updateStats(editorRef.current.innerText || "");
    }
  }, [notes, autoSave]);

  useEffect(() => {
    if (notes.length === 0) createNote();
    else if (!currentId) loadNote(notes[0].id);
  }, [notes.length, currentId, createNote, loadNote]);

  const saveFile = useCallback(() => {
    autoSave(true);
    const content = editorRef.current?.innerHTML || "";
    const title = notes.find(n => n.id === currentId)?.title || "note";
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title} — KnexByte Systems</title>
<style>
*{box-sizing:border-box;}
body{background:#0d1117;color:#e6edf3;font-family:Calibri,sans-serif;max-width:1200px;margin:30px auto;padding:0 24px;font-size:15px;line-height:1.8;}
h1{font-size:2em;color:#e6edf3;}h2{font-size:1.5em;}h3{font-size:1.2em;}
table{width:100%;border-collapse:collapse;border:1px solid #21262d;}th,td{padding:10px 14px;border-bottom:1px solid #21262d;}th{background:#161b22;color:#1a9fd4;font-size:11px;text-transform:uppercase;}
blockquote{border-left:3px solid #1a9fd4;padding:8px 16px;color:#8b949e;font-style:italic;background:#161b22;}
.kb-code-block{border:1px solid #30363d;border-radius:10px;overflow:hidden;margin:16px 0;}
.logo-export { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; border-bottom: 1px solid #21262d; padding-bottom: 20px; }
.knex { font-weight: 800; font-size: 24px; color: transparent; -webkit-text-stroke: 1px #e6edf3; }
.byte { font-weight: 800; font-size: 24px; color: #00AEEF; }
</style></head><body>
<div class="logo-export">
  <div style="display:flex;flex-direction:column;line-height:1;">
    <div style="display:flex;align-items:center;gap:4px;">
      <span class="knex">KNEX</span><span class="byte">BYTE</span>
    </div>
    <span style="font-size:12px;color:transparent;-webkit-text-stroke:0.5px #e6edf3;align-self:flex-end;letter-spacing:2px;">systems</span>
  </div>
</div>
${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = title.replace(/[^a-z0-9]/gi, "_") + ".html";
    a.click();
    setSaveStatus("saved");
  }, [notes, currentId, autoSave]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveFile(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") { e.preventDefault(); setShowFind(f => !f); }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") { e.preventDefault(); createNote(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote, saveFile]);

  const deleteNote = (id: string) => {
    const nextNotes = notes.filter(n => n.id !== id);
    setNotes(nextNotes);
    localStorage.setItem("kb-notes", JSON.stringify(nextNotes));
    
    if (currentId === id) {
      if (nextNotes.length > 0) loadNote(nextNotes[0].id);
      else createNote();
    }
  };

  const onInput = () => {
    const text = editorRef.current?.innerText || "";
    updateStats(text);
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => autoSave(), 1500);
  };

  const updateStats = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  const cmd = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const insertHTML = (html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
  };

  const insertCodeBlock = () => {
    if (!codeContent.trim()) { setShowCodeModal(false); return; }
    const escaped = codeContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `<div class="kb-code-block" contenteditable="false" style="margin:16px 0;border-radius:10px;overflow:hidden;border:1px solid #30363d;font-family:'DM Mono',monospace;">
<div style="background:#161b22;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #21262d;">
<span style="font-size:10px;color:#1a9fd4;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${codeLang}</span>
<span style="font-size:10px;color:#4a5568;">// KnexByte Systems</span>
</div>
<pre style="margin:0;padding:16px;background:#0d1117;overflow-x:auto;"><code style="font-family:'DM Mono',monospace;font-size:13px;color:#e6edf3;line-height:1.7;">${escaped}</code></pre>
</div><p></p>`;
    insertHTML(html);
    setShowCodeModal(false);
    setCodeContent("");
  };

  const insertTable = () => {
    let html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px;border:1px solid #21262d;border-radius:8px;overflow:hidden;"><thead><tr>`;
    for (let c = 0; c < tableCols; c++) html += `<th style="background:#161b22;padding:10px 14px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#1a9fd4;border-bottom:1px solid #21262d;">Col ${c + 1}</th>`;
    html += `</tr></thead><tbody>`;
    for (let r = 0; r < tableRows - 1; r++) {
      html += `<tr>`;
      for (let c = 0; c < tableCols; c++) html += `<td style="padding:10px 14px;border-bottom:1px solid #161b22;color:#8b949e;">Cell</td>`;
      html += `</tr>`;
    }
    html += `</tbody></table><p></p>`;
    insertHTML(html);
    setShowTableModal(false);
  };

  const doReplace = () => {
    if (!findVal || !editorRef.current) return;
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
      new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), replaceVal
    );
  };

  const doReplaceAll = () => {
    if (!findVal || !editorRef.current) return;
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
      new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), replaceVal
    );
  };

  const currentNote = notes.find(n => n.id === currentId);

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "var(--kb-bg)", color: "var(--kb-text)", overflow: "hidden"
    }}>
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        title={currentNote?.title || "Untitled Note"} 
        onSave={saveFile}
        onCreateNote={createNote}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {sidebarOpen && (
          <Sidebar 
            notes={notes} 
            currentId={currentId} 
            onLoadNote={loadNote} 
            onDeleteNote={deleteNote} 
            onCreateNote={createNote} 
          />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Toolbar 
            onCmd={cmd} 
            onInsertHTML={insertHTML} 
            onShowCode={() => setShowCodeModal(true)} 
            onShowTable={() => setShowTableModal(true)} 
            onShowFind={() => setShowFind(f => !f)}
            findActive={showFind}
            editorFont={editorFont}
            onFontChange={setEditorFont}
          />

          {showFind && (
            <FindReplaceBar 
              findVal={findVal} 
              setFindVal={setFindVal} 
              replaceVal={replaceVal} 
              setReplaceVal={setReplaceVal} 
              onReplace={doReplace} 
              onReplaceAll={doReplaceAll} 
              onClose={() => setShowFind(false)} 
            />
          )}

          <Editor 
            ref={editorRef} 
            onInput={onInput} 
            editorFont={editorFont} 
          />

          <StatusBar 
            wordCount={wordCount} 
            charCount={charCount} 
            saveStatus={saveStatus} 
          />
        </div>
      </div>

      {showCodeModal && (
        <CodeModal 
          codeLang={codeLang} 
          setCodeLang={setCodeLang} 
          codeContent={codeContent} 
          setCodeContent={setCodeContent} 
          onSubmit={insertCodeBlock} 
          onClose={() => setShowCodeModal(false)} 
        />
      )}

      {showTableModal && (
        <TableModal 
          tableRows={tableRows} 
          setTableRows={setTableRows} 
          tableCols={tableCols} 
          setTableCols={setTableCols} 
          onSubmit={insertTable} 
          onClose={() => setShowTableModal(false)}
        />
      )}
    </div>
  );
};

export default App;
