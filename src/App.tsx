import { useState, useEffect, useRef, useMemo } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EditorPane from './components/EditorPane';
import ModalManager from './components/ModalManager';
import { DEFAULT_FONT } from './constants';
import { useNotes } from './hooks/useNotes';
import { useEditorCommands } from './hooks/useEditorCommands';
import { usePDF } from './hooks/usePDF';
import { useFindReplace } from './hooks/useFindReplace';
import { useInsertContent } from './hooks/useInsertContent';

const App = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const notes = useNotes(editorRef);
  const editor = useEditorCommands(editorRef);
  const { downloadAsPDF } = usePDF(editorRef, notes.notes, notes.currentId);
  const findReplace = useFindReplace(editorRef);
  const content = useInsertContent(editor.insertHTML);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editorFont, setEditorFont] = useState(DEFAULT_FONT);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    if (notes.notes.length === 0) notes.createNote();
    else if (!notes.currentId) notes.loadNote(notes.notes[0].id);
  }, [notes.notes.length, notes.currentId, notes.createNote, notes.loadNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); downloadAsPDF(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") { e.preventDefault(); findReplace.toggleFind(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") { e.preventDefault(); notes.createNote(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [notes.createNote, downloadAsPDF, findReplace.toggleFind]);

  const currentNote = useMemo(
    () => notes.notes.find(n => n.id === notes.currentId),
    [notes.notes, notes.currentId]
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--kb-bg)", color: "var(--kb-text)", overflow: "hidden" }}>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        title={currentNote?.title || "Untitled Note"}
        onDownloadPDF={downloadAsPDF}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {sidebarOpen && (
          <Sidebar
            notes={notes.notes}
            currentId={notes.currentId}
            onLoadNote={notes.loadNote}
            onDeleteNote={notes.deleteNote}
            onCreateNote={notes.createNote}
          />
        )}
        <EditorPane
          editorRef={editorRef}
          onInput={notes.onInput}
          editorFont={editorFont}
          onFontChange={setEditorFont}
          onCmd={editor.cmd}
          onInsertHTML={editor.insertHTML}
          onShowCode={() => content.setShowCodeModal(true)}
          onShowTable={() => content.setShowTableModal(true)}
          findReplace={findReplace}
          wordCount={notes.wordCount}
          charCount={notes.charCount}
          saveStatus={notes.saveStatus}
        />
      </div>

      <ModalManager content={content} />
    </div>
  );
};

export default App;
