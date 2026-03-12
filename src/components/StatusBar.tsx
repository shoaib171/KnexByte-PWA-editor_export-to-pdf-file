import React from 'react';
import { SaveStatus } from '../types';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  saveStatus: SaveStatus;
}

const StatusBar = ({ wordCount, charCount, saveStatus }: StatusBarProps): React.JSX.Element => {
  return (
    <div style={{
      height: 26, background: "var(--kb-sidebar)", borderTop: "1px solid var(--kb-border)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 16,
      flexShrink: 0
    }}>
      <span style={{ fontSize: 10.5, color: "var(--kb-text-muted)", opacity: 0.6, fontFamily: "'DM Mono',monospace" }}>{wordCount} words</span>
      <span style={{ fontSize: 10.5, color: "var(--kb-text-muted)", opacity: 0.6, fontFamily: "'DM Mono',monospace" }}>{charCount} chars</span>
      <span style={{ 
        fontSize: 10.5, 
        color: saveStatus === "saved" ? "var(--kb-success)" : "var(--kb-warning)", 
        fontFamily: "'DM Mono',monospace",
        display: "flex", alignItems: "center", gap: 4
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
        {saveStatus === "saved" ? "Saved" : "Unsaved"}
      </span>
      <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--kb-border)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.5px" }}>
        KNEXBYTE SYSTEMS · EDITOR v1.0
      </span>
    </div>
  );
};

export default StatusBar;
