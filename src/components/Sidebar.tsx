import React from 'react';
import { Plus } from 'lucide-react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  active: boolean;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteItem = ({ note, active, onLoad, onDelete }: NoteItemProps): React.JSX.Element => {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={() => onLoad(note.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: active ? "var(--kb-blue)20" : hov ? "var(--kb-item-hover)" : "transparent",
        border: `1px solid ${active ? "var(--kb-blue)40" : "transparent"}`,
        marginBottom: 3,
        transition: "all 0.15s",
        position: "relative"
      }}
    >
      <div style={{
        fontSize: 12.5,
        fontWeight: 500,
        color: active ? "var(--kb-text)" : "var(--kb-text-muted)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontFamily: "system-ui, sans-serif"
      }}>{note.title || "Untitled"}</div>
      <div style={{ fontSize: 10, color: "var(--kb-text-muted)", opacity: 0.6, marginTop: 3, fontFamily: "system-ui,monospace" }}>
        {note.date}
      </div>
      {hov && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--kb-item-hover)",
            border: "1px solid var(--kb-border)",
            color: "var(--kb-danger)",
            borderRadius: 5,
            width: 22,
            height: 22,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >×</button>
      )}
    </div>
  );
};

interface SidebarProps {
  notes: Note[];
  currentId: string | null;
  onLoadNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: () => void;
}

const Sidebar = ({ notes, currentId, onLoadNote, onDeleteNote, onCreateNote }: SidebarProps): React.JSX.Element => {
  return (
    <div style={{
      width: 220,
      background: "var(--kb-sidebar)",
      borderRight: "1px solid var(--kb-border)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0
    }}>
      <div style={{ padding: "12px 12px 12px", borderBottom: "1px solid var(--kb-border)" }}>
        <div style={{
          fontSize: 9,
          fontWeight: 600,
          color: "var(--kb-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          fontFamily: "'DM Mono',monospace",
          marginBottom: 12
        }}>Documents</div>
        <button onClick={onCreateNote} style={{
          width: "100%",
          padding: "8px 10px",
          background: "transparent",
          border: "1px solid var(--kb-blue)",
          borderRadius: 8,
          color: "var(--kb-blue)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "all 0.2s"
        }}>
          <Plus size={14} strokeWidth={2.5} /> New Document
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            active={currentId === note.id}
            onLoad={onLoadNote}
            onDelete={onDeleteNote}
          />
        ))}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--kb-border)", textAlign: "center" }}>
        <span style={{ fontSize: 10, color: "var(--kb-text-muted)", letterSpacing: "1px", opacity: 0.5 }}>KB EDITOR CLOUD</span>
      </div>
    </div>
  );
};

export default Sidebar;
