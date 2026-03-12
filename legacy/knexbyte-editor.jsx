import { useState, useEffect, useRef, useCallback } from "react";

const KB_BLUE = "#1a9fd4";
const KB_DARK = "#0d1117";

// Claude / system default font — same as what Claude uses
const DEFAULT_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const FONT_OPTIONS = [
  { label: "System (Default)", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" },
  { label: "Georgia (Serif)", value: "Georgia, 'Times New Roman', serif" },
  { label: "Palatino", value: "'Palatino Linotype', Palatino, serif" },
  { label: "Courier (Mono)", value: "'Courier New', Courier, monospace" },
  { label: "Trebuchet", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
];

const LANGUAGES = [
  "javascript","python","typescript","html","css","java","cpp","c",
  "rust","go","php","sql","bash","json","xml","yaml","plaintext"
];

function KBLogo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"10px",userSelect:"none"}}>
      {/* Icon mark */}
      <div style={{
        width:34,height:34,background:"linear-gradient(135deg,#1a9fd4,#0d6e9e)",
        borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 0 16px #1a9fd440",position:"relative",overflow:"hidden"
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(135deg,rgba(255,255,255,0.12),transparent)"
        }}/>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 6l4 6-4 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6h8M12 12h6M12 18h8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="19" cy="6" r="1.5" fill="#7ee8ff" opacity="0.9"/>
        </svg>
      </div>
      {/* Wordmark */}
      <div style={{lineHeight:1}}>
        <div style={{
          fontFamily:"system-ui, sans-serif",
          fontWeight:800,fontSize:16,letterSpacing:"-0.3px",
          display:"flex",alignItems:"baseline",gap:1
        }}>
          <span style={{color:"#e6edf3"}}>KNEX</span>
          <span style={{color:KB_BLUE}}>BYTE</span>
        </div>
        <div style={{
          fontSize:9,fontWeight:500,letterSpacing:"2.5px",
          color:"#4a5568",textTransform:"uppercase",marginTop:2,
          fontFamily:"system-ui, monospace"
        }}>SYSTEMS</div>
      </div>
    </div>
  );
}

function IconBtn({ title, onClick, active, children, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth:30,height:30,border:"none",borderRadius:7,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"0 6px",fontSize:12,fontWeight:600,gap:3,transition:"all 0.15s",
        background: active ? "#1a9fd420" : hov ? "#161b22" : "transparent",
        color: danger ? (hov?"#ff7b7b":"#f85149") : active ? KB_BLUE : hov ? "#e6edf3" : "#8b949e",
        outline: active ? `1px solid ${KB_BLUE}40` : "none"
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div style={{width:1,height:20,background:"#21262d",margin:"0 4px",flexShrink:0}}/>;
}

function NoteItem({ note, active, onLoad, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onLoad(note.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:"10px 12px",borderRadius:8,cursor:"pointer",
        background: active ? "#1a9fd415" : hov ? "#161b22" : "transparent",
        border: `1px solid ${active ? "#1a9fd430" : "transparent"}`,
        marginBottom:3,transition:"all 0.15s",position:"relative"
      }}
    >
      <div style={{
        fontSize:12.5,fontWeight:500,color: active ? "#e6edf3" : "#8b949e",
        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
        fontFamily:"system-ui, sans-serif"
      }}>{note.title||"Untitled"}</div>
      <div style={{fontSize:10,color:"#3d444d",marginTop:3,fontFamily:"system-ui,monospace"}}>
        {note.date}
      </div>
      {hov && (
        <button
          onClick={e=>{e.stopPropagation();onDelete(note.id)}}
          style={{
            position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
            background:"#21262d",border:"1px solid #30363d",color:"#f85149",
            borderRadius:5,width:22,height:22,fontSize:12,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}
        >×</button>
      )}
    </div>
  );
}

export default function KnexByteEditor() {
  const editorRef = useRef(null);
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("kb-notes")||"[]");
    } catch { return []; }
  });
  const [currentId, setCurrentId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const [codeLang, setCodeLang] = useState("javascript");
  const [codeContent, setCodeContent] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [findVal, setFindVal] = useState("");
  const [replaceVal, setReplaceVal] = useState("");
  const saveTimer = useRef(null);

  const [editorFont, setEditorFont] = useState(DEFAULT_FONT);

  useEffect(() => {
    if (notes.length === 0) createNote();
    else loadNote(notes[0].id);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey||e.metaKey) && e.key==="s") { e.preventDefault(); saveFile(); }
      if ((e.ctrlKey||e.metaKey) && e.key==="f") { e.preventDefault(); setShowFind(f=>!f); }
      if ((e.ctrlKey||e.metaKey) && e.key==="n") { e.preventDefault(); createNote(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function createNote() {
    const note = {
      id: Date.now().toString(),
      title:"Untitled Note",
      content:"<p></p>",
      date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})
    };
    setNotes(prev => {
      const next = [note,...prev];
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    setCurrentId(note.id);
    if (editorRef.current) editorRef.current.innerHTML = "<p></p>";
    updateStats("");
  }

  function loadNote(id) {
    autoSave(true);
    setCurrentId(id);
    const note = notes.find(n=>n.id===id);
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content||"<p></p>";
      updateStats(editorRef.current.innerText||"");
    }
  }

  function deleteNote(id) {
    setNotes(prev => {
      const next = prev.filter(n=>n.id!==id);
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    if (currentId===id) {
      const remaining = notes.filter(n=>n.id!==id);
      if (remaining.length > 0) loadNote(remaining[0].id);
      else createNote();
    }
  }

  function autoSave(silent=false) {
    if (!currentId || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const text = editorRef.current.innerText||"";
    const title = text.trim().split("\n")[0]?.slice(0,40)||"Untitled Note";
    setNotes(prev => {
      const next = prev.map(n => n.id===currentId ? {...n,content,title} : n);
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    if (!silent) setSaveStatus("saved");
  }

  function onInput() {
    const text = editorRef.current?.innerText||"";
    updateStats(text);
    setSaveStatus("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => autoSave(), 1500);
  }

  function updateStats(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  }

  function cmd(command, value=null) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function insertHTML(html) {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
  }

  function insertCodeBlock() {
    if (!codeContent.trim()) { setShowCodeModal(false); return; }
    const escaped = codeContent.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
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
  }

  function insertTable() {
    let html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px;border:1px solid #21262d;border-radius:8px;overflow:hidden;"><thead><tr>`;
    for (let c=0;c<tableCols;c++) html+=`<th style="background:#161b22;padding:10px 14px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#1a9fd4;border-bottom:1px solid #21262d;">Col ${c+1}</th>`;
    html+=`</tr></thead><tbody>`;
    for (let r=0;r<tableRows-1;r++) {
      html+=`<tr>`;
      for (let c=0;c<tableCols;c++) html+=`<td style="padding:10px 14px;border-bottom:1px solid #161b22;color:#8b949e;">Cell</td>`;
      html+=`</tr>`;
    }
    html+=`</tbody></table><p></p>`;
    insertHTML(html);
    setShowTableModal(false);
  }

  function doReplace() {
    if (!findVal) return;
    if (editorRef.current) {
      editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
        new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"), replaceVal
      );
    }
  }

  function doReplaceAll() {
    if (!findVal) return;
    if (editorRef.current) {
      editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
        new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"), replaceVal
      );
    }
  }

  function saveFile() {
    autoSave(true);
    const content = editorRef.current?.innerHTML||"";
    const title = notes.find(n=>n.id===currentId)?.title||"note";
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title} — KnexByte Systems</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}body{background:#0d1117;color:#e6edf3;font-family:'Syne',sans-serif;max-width:740px;margin:60px auto;padding:0 40px;font-size:15px;line-height:1.8;}
h1{font-size:2em;color:#e6edf3;}h2{font-size:1.5em;}h3{font-size:1.2em;}
table{width:100%;border-collapse:collapse;border:1px solid #21262d;}th,td{padding:10px 14px;border-bottom:1px solid #21262d;}th{background:#161b22;color:#1a9fd4;font-size:11px;text-transform:uppercase;}
blockquote{border-left:3px solid #1a9fd4;padding:8px 16px;color:#8b949e;font-style:italic;background:#161b22;}
.kb-code-block{border:1px solid #30363d;border-radius:10px;overflow:hidden;margin:16px 0;}
</style></head><body>
<div style="margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:12px;">
  <div style="width:32px;height:32px;background:linear-gradient(135deg,#1a9fd4,#0d6e9e);border-radius:7px;display:flex;align-items:center;justify-content:center;">
    <span style="color:white;font-weight:800;font-size:14px;">KB</span>
  </div>
  <div><span style="font-weight:800;color:#e6edf3;">KNEX</span><span style="font-weight:800;color:#1a9fd4;">BYTE</span>
  <span style="font-size:10px;color:#4a5568;letter-spacing:2px;margin-left:4px;">SYSTEMS</span></div>
</div>
${content}</body></html>`;
    const blob = new Blob([html],{type:"text/html"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = title.replace(/[^a-z0-9]/gi,"_")+".html";
    a.click();
    setSaveStatus("saved");
  }

  const currentNote = notes.find(n=>n.id===currentId);

  return (
    <div style={{
      height:"100vh",display:"flex",flexDirection:"column",
      background:KB_DARK,color:"#e6edf3",overflow:"hidden",
      fontFamily:"'Syne',sans-serif"
    }}>
      {/* ── TITLEBAR ── */}
      <div style={{
        height:52,background:"#010409",borderBottom:"1px solid #21262d",
        display:"flex",alignItems:"center",padding:"0 16px",gap:12,
        flexShrink:0
      }}>
        <KBLogo/>
        <div style={{width:1,height:24,background:"#21262d",margin:"0 4px"}}/>
        <span style={{
          flex:1,fontSize:12.5,color:"#4a5568",
          fontFamily:"'DM Mono',monospace",letterSpacing:"0.3px"
        }}>
          {currentNote?.title||"Untitled Note"}
        </span>

        {/* Theme / Sidebar / Save */}
        <div style={{display:"flex",gap:4}}>
          <IconBtn title="Toggle Sidebar" onClick={()=>setSidebarOpen(s=>!s)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </IconBtn>
          <IconBtn title="Save (Ctrl+S)" onClick={saveFile}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </IconBtn>
        </div>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <div style={{
            width:220,background:"#010409",borderRight:"1px solid #21262d",
            display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0
          }}>
            <div style={{padding:"12px 12px 8px",borderBottom:"1px solid #21262d"}}>
              <div style={{
                fontSize:9,fontWeight:600,color:"#3d444d",
                textTransform:"uppercase",letterSpacing:"1.5px",
                fontFamily:"'DM Mono',monospace",marginBottom:8
              }}>Documents</div>
              <button onClick={createNote} style={{
                width:"100%",padding:"7px 10px",background:"linear-gradient(135deg,#1a9fd4,#0d6e9e)",
                color:"white",border:"none",borderRadius:8,
                fontSize:12,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",gap:6,fontFamily:"'Syne',sans-serif",
                boxShadow:"0 0 16px #1a9fd430",transition:"opacity 0.15s"
              }}>
                <span style={{fontSize:16,lineHeight:1}}>+</span> New Note
              </button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:8}}>
              {notes.map(n => (
                <NoteItem
                  key={n.id} note={n}
                  active={n.id===currentId}
                  onLoad={loadNote}
                  onDelete={deleteNote}
                />
              ))}
            </div>
            <div style={{
              padding:"10px 12px",borderTop:"1px solid #21262d",
              fontSize:9,color:"#3d444d",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.5px"
            }}>
              © 2025 KnexByte Systems
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* ── TOOLBAR ── */}
          <div style={{
            background:"#010409",borderBottom:"1px solid #21262d",
            padding:"6px 14px",display:"flex",alignItems:"center",
            gap:2,flexWrap:"wrap",minHeight:46,flexShrink:0
          }}>
            <select
              onChange={e=>{cmd("formatBlock",e.target.value);e.target.value="p"}}
              style={{
                height:28,background:"#161b22",color:"#8b949e",
                border:"1px solid #21262d",borderRadius:7,padding:"0 8px",
                fontSize:11.5,cursor:"pointer",outline:"none",fontFamily:"'DM Mono',monospace"
              }}
            >
              <option value="p">Paragraph</option>
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>

            <select
              onChange={e=>{
                cmd("fontSize",7);
                document.querySelectorAll('[contenteditable] font[size="7"]').forEach(el=>{
                  el.removeAttribute("size");el.style.fontSize=e.target.value+"px";
                });
              }}
              style={{
                height:28,background:"#161b22",color:"#8b949e",
                border:"1px solid #21262d",borderRadius:7,padding:"0 8px",
                fontSize:11.5,cursor:"pointer",outline:"none",fontFamily:"'DM Mono',monospace",
                width:56
              }}
            >
              {[12,13,14,15,16,18,20,24,28,32].map(s=>(
                <option key={s} value={s} selected={s===15}>{s}</option>
              ))}
            </select>

            <select
              value={editorFont}
              onChange={e => {
                const f = e.target.value;
                setEditorFont(f);
                if (editorRef.current) editorRef.current.style.fontFamily = f;
              }}
              style={{
                height:28,background:"#161b22",color:"#8b949e",
                border:"1px solid #21262d",borderRadius:7,padding:"0 8px",
                fontSize:11.5,cursor:"pointer",outline:"none",
                fontFamily:"system-ui,sans-serif", maxWidth:148
              }}
            >
              {FONT_OPTIONS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            <Sep/>

            <IconBtn title="Bold" onClick={()=>cmd("bold")}><b>B</b></IconBtn>
            <IconBtn title="Italic" onClick={()=>cmd("italic")}><i>I</i></IconBtn>
            <IconBtn title="Underline" onClick={()=>cmd("underline")}><u>U</u></IconBtn>
            <IconBtn title="Strikethrough" onClick={()=>cmd("strikeThrough")}>
              <span style={{textDecoration:"line-through"}}>S</span>
            </IconBtn>

            <Sep/>

            <IconBtn title="Align Left" onClick={()=>cmd("justifyLeft")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
            </IconBtn>
            <IconBtn title="Center" onClick={()=>cmd("justifyCenter")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </IconBtn>
            <IconBtn title="Align Right" onClick={()=>cmd("justifyRight")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
            </IconBtn>

            <Sep/>

            <IconBtn title="Bullet List" onClick={()=>cmd("insertUnorderedList")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
            </IconBtn>
            <IconBtn title="Numbered List" onClick={()=>cmd("insertOrderedList")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="7" x2="21" y2="7"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="17" x2="21" y2="17"/></svg>
            </IconBtn>

            <Sep/>

            <IconBtn title="Blockquote" onClick={()=>cmd("formatBlock","blockquote")}>❝</IconBtn>
            <IconBtn title="Divider" onClick={()=>insertHTML('<hr style="border:none;border-top:1px solid #21262d;margin:20px 0;"><p></p>')}>—</IconBtn>
            <IconBtn title="Code Block" onClick={()=>setShowCodeModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </IconBtn>
            <IconBtn title="Table" onClick={()=>setShowTableModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
            </IconBtn>

            <Sep/>

            <div title="Text Color" style={{position:"relative"}}>
              <input type="color" defaultValue="#1a9fd4"
                onChange={e=>cmd("foreColor",e.target.value)}
                style={{width:28,height:28,border:"1px solid #21262d",background:"transparent",cursor:"pointer",borderRadius:7,padding:2}}
              />
            </div>
            <div title="Highlight">
              <input type="color" defaultValue="#1a9fd430"
                onChange={e=>cmd("hiliteColor",e.target.value)}
                style={{width:28,height:28,border:"1px solid #21262d",background:"transparent",cursor:"pointer",borderRadius:7,padding:2}}
              />
            </div>

            <Sep/>

            <IconBtn title="Undo" onClick={()=>cmd("undo")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </IconBtn>
            <IconBtn title="Redo" onClick={()=>cmd("redo")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </IconBtn>
            <Sep/>
            <IconBtn title="Find & Replace (Ctrl+F)" onClick={()=>setShowFind(f=>!f)} active={showFind}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </IconBtn>
            <IconBtn title="Print" onClick={()=>window.print()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </IconBtn>
          </div>

          {/* Find Bar */}
          {showFind && (
            <div style={{
              background:"#010409",borderBottom:"1px solid #21262d",
              padding:"8px 16px",display:"flex",alignItems:"center",gap:8,flexShrink:0
            }}>
              <input value={findVal} onChange={e=>setFindVal(e.target.value)}
                placeholder="Find…"
                style={{
                  height:28,background:"#161b22",border:"1px solid #21262d",borderRadius:7,
                  padding:"0 10px",color:"#e6edf3",fontSize:12.5,outline:"none",
                  fontFamily:"'DM Mono',monospace",width:200
                }}
              />
              <input value={replaceVal} onChange={e=>setReplaceVal(e.target.value)}
                placeholder="Replace…"
                style={{
                  height:28,background:"#161b22",border:"1px solid #21262d",borderRadius:7,
                  padding:"0 10px",color:"#e6edf3",fontSize:12.5,outline:"none",
                  fontFamily:"'DM Mono',monospace",width:180
                }}
              />
              <button onClick={doReplace} style={{height:26,padding:"0 10px",background:"#161b22",border:"1px solid #21262d",color:"#8b949e",borderRadius:6,fontSize:11.5,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Replace</button>
              <button onClick={doReplaceAll} style={{height:26,padding:"0 10px",background:"#161b22",border:"1px solid #21262d",color:"#8b949e",borderRadius:6,fontSize:11.5,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>All</button>
              <button onClick={()=>setShowFind(false)} style={{marginLeft:"auto",width:24,height:24,background:"transparent",border:"none",color:"#4a5568",fontSize:16,cursor:"pointer",borderRadius:5}}>×</button>
            </div>
          )}

          {/* ── EDITOR ── */}
          <div style={{
            flex:1,overflowY:"auto",padding:"48px 0",
            display:"flex",justifyContent:"center",
            background:"#0d1117"
          }}>
            <div style={{width:"100%",maxWidth:720,padding:"0 48px"}}>
              {/* Subtle grid bg */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={onInput}
                onKeyDown={e=>{
                  if(e.key==="Tab"){e.preventDefault();document.execCommand("insertHTML",false,"&nbsp;&nbsp;&nbsp;&nbsp;");}
                }}
                spellCheck
                style={{
                  outline:"none",minHeight:600,
                  fontSize:15.5,lineHeight:1.8,color:"#e6edf3",
                  caretColor:KB_BLUE,
                  fontFamily: editorFont,
                }}
              />
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div style={{
            height:26,background:"#010409",borderTop:"1px solid #21262d",
            display:"flex",alignItems:"center",padding:"0 16px",gap:16,
            flexShrink:0
          }}>
            {[
              `${wordCount} words`,
              `${charCount} chars`,
              saveStatus==="saved"
                ? <span style={{color:"#3fb950",display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:"#3fb950",display:"inline-block"}}/>Saved</span>
                : <span style={{color:"#d29922",display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:"#d29922",display:"inline-block"}}/>Unsaved</span>
            ].map((item,i)=>(
              <span key={i} style={{fontSize:10.5,color:"#3d444d",fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center"}}>
                {item}
              </span>
            ))}
            <span style={{marginLeft:"auto",fontSize:10,color:"#21262d",fontFamily:"'DM Mono',monospace",letterSpacing:"0.5px"}}>
              KNEXBYTE SYSTEMS · EDITOR v1.0
            </span>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {/* Code Modal */}
      {showCodeModal && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowCodeModal(false)}} style={{
          position:"fixed",inset:0,background:"rgba(1,4,9,0.8)",backdropFilter:"blur(6px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:100
        }}>
          <div style={{
            background:"#161b22",border:"1px solid #30363d",borderRadius:14,
            padding:24,width:440,
            boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px #21262d"
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:KB_BLUE}}/>
              <h3 style={{fontSize:14,fontWeight:700,margin:0}}>Insert Code Block</h3>
            </div>
            <label style={{display:"block",fontSize:11,color:"#4a5568",marginBottom:4,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"1px"}}>Language</label>
            <select value={codeLang} onChange={e=>setCodeLang(e.target.value)} style={{
              width:"100%",background:"#0d1117",border:"1px solid #21262d",borderRadius:8,
              padding:"8px 12px",color:"#e6edf3",fontSize:13,outline:"none",marginBottom:12,
              fontFamily:"'DM Mono',monospace"
            }}>
              {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
            </select>
            <label style={{display:"block",fontSize:11,color:"#4a5568",marginBottom:4,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"1px"}}>Code</label>
            <textarea value={codeContent} onChange={e=>setCodeContent(e.target.value)}
              placeholder="// Paste your code here…"
              style={{
                width:"100%",background:"#0d1117",border:"1px solid #21262d",borderRadius:8,
                padding:"12px",color:"#e6edf3",fontSize:13,outline:"none",
                fontFamily:"'DM Mono',monospace",minHeight:140,resize:"vertical",marginBottom:16,
                lineHeight:1.6
              }}
            />
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setShowCodeModal(false)} style={{padding:"7px 16px",background:"transparent",border:"1px solid #21262d",borderRadius:8,color:"#8b949e",fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>Cancel</button>
              <button onClick={insertCodeBlock} style={{padding:"7px 16px",background:"linear-gradient(135deg,#1a9fd4,#0d6e9e)",border:"none",borderRadius:8,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 16px #1a9fd430"}}>Insert Block</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowTableModal(false)}} style={{
          position:"fixed",inset:0,background:"rgba(1,4,9,0.8)",backdropFilter:"blur(6px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:100
        }}>
          <div style={{
            background:"#161b22",border:"1px solid #30363d",borderRadius:14,
            padding:24,width:340,
            boxShadow:"0 20px 60px rgba(0,0,0,0.6)"
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:KB_BLUE}}/>
              <h3 style={{fontSize:14,fontWeight:700,margin:0}}>Insert Table</h3>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <input type="number" value={tableRows} onChange={e=>setTableRows(+e.target.value)} min={1} max={20}
                style={{width:60,height:34,background:"#0d1117",border:"1px solid #21262d",borderRadius:8,padding:"0 8px",color:"#e6edf3",fontSize:14,textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace"}}
              />
              <span style={{fontSize:12,color:"#4a5568",fontFamily:"'DM Mono',monospace"}}>rows ×</span>
              <input type="number" value={tableCols} onChange={e=>setTableCols(+e.target.value)} min={1} max={10}
                style={{width:60,height:34,background:"#0d1117",border:"1px solid #21262d",borderRadius:8,padding:"0 8px",color:"#e6edf3",fontSize:14,textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace"}}
              />
              <span style={{fontSize:12,color:"#4a5568",fontFamily:"'DM Mono',monospace"}}>cols</span>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setShowTableModal(false)} style={{padding:"7px 16px",background:"transparent",border:"1px solid #21262d",borderRadius:8,color:"#8b949e",fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>Cancel</button>
              <button onClick={insertTable} style={{padding:"7px 16px",background:"linear-gradient(135deg,#1a9fd4,#0d6e9e)",border:"none",borderRadius:8,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 16px #1a9fd430"}}>Insert</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable] h1{font-size:2em;font-weight:700;margin:0.8em 0 0.4em;line-height:1.2;color:#e6edf3;}
        [contenteditable] h2{font-size:1.5em;font-weight:600;margin:0.8em 0 0.4em;color:#e6edf3;}
        [contenteditable] h3{font-size:1.2em;font-weight:600;margin:0.6em 0 0.3em;color:#e6edf3;}
        [contenteditable] p{margin:0.3em 0;}
        [contenteditable] ul,[contenteditable] ol{padding-left:1.8em;margin:0.4em 0;}
        [contenteditable] blockquote{border-left:3px solid #1a9fd4;padding:8px 16px;color:#8b949e;font-style:italic;background:#161b22;border-radius:0 8px 8px 0;margin:12px 0;}
        [contenteditable] a{color:#1a9fd4;}
        [contenteditable]::-webkit-scrollbar{width:5px;}
        [contenteditable]::-webkit-scrollbar-thumb{background:#21262d;border-radius:3px;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#21262d;border-radius:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
      `}</style>
    </div>
  );
}
