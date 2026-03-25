import { useState, useRef, useCallback, RefObject } from 'react';
import { Note, SaveStatus } from '../types';

export function useNotes(editorRef: RefObject<HTMLDivElement | null>) {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem("kb-notes") || "[]"); }
    catch { return []; }
  });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Latest-value refs — break dep chains without stale closures
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const currentIdRef = useRef(currentId);
  currentIdRef.current = currentId;
  const saveTimer = useRef<number | null>(null);

  const updateStats = useCallback((text: string) => {
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  }, []);

  // Stable — reads currentId/notes via refs, no volatile deps
  const autoSave = useCallback((silent = false) => {
    const id = currentIdRef.current;
    if (!id || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || "";
    const title = text.trim().split("\n")[0]?.slice(0, 40) || "Untitled Note";
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, content, title } : n);
      localStorage.setItem("kb-notes", JSON.stringify(next));
      return next;
    });
    if (!silent) setSaveStatus("saved");
  }, [editorRef]);

  // Stable — reads notes via ref
  const loadNote = useCallback((id: string) => {
    autoSave(true);
    setCurrentId(id);
    const note = notesRef.current.find(n => n.id === id);
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content || "<p></p>";
      updateStats(editorRef.current.innerText || "");
    }
  }, [autoSave, editorRef, updateStats]);

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
  }, [editorRef, updateStats]);

  // Stable — reads notes/currentId via refs
  const deleteNote = useCallback((id: string) => {
    const nextNotes = notesRef.current.filter(n => n.id !== id);
    setNotes(nextNotes);
    localStorage.setItem("kb-notes", JSON.stringify(nextNotes));
    if (currentIdRef.current === id) {
      if (nextNotes.length > 0) loadNote(nextNotes[0].id);
      else createNote();
    }
  }, [loadNote, createNote]);

  // Stable — autoSave is stable
  const onInput = useCallback(() => {
    const text = editorRef.current?.innerText || "";
    updateStats(text);
    setSaveStatus("unsaved");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => autoSave(), 1500);
  }, [editorRef, autoSave, updateStats]);

  return {
    notes, currentId, saveStatus, wordCount, charCount,
    createNote, autoSave, loadNote, deleteNote, onInput
  };
}
