import { memo, RefObject } from 'react';
import Toolbar from './Toolbar';
import FindReplaceBar from './FindReplaceBar';
import Editor from './Editor';
import StatusBar from './StatusBar';
import { SaveStatus } from '../types';
import { useFindReplace } from '../hooks/useFindReplace';

interface EditorPaneProps {
  editorRef: RefObject<HTMLDivElement>;
  onInput: () => void;
  editorFont: string;
  onFontChange: (font: string) => void;
  onCmd: (command: string, value?: string) => void;
  onInsertHTML: (html: string) => void;
  onShowCode: () => void;
  onShowTable: () => void;
  findReplace: ReturnType<typeof useFindReplace>;
  wordCount: number;
  charCount: number;
  saveStatus: SaveStatus;
}

const EditorPane = memo(({
  editorRef, onInput, editorFont, onFontChange,
  onCmd, onInsertHTML, onShowCode, onShowTable,
  findReplace, wordCount, charCount, saveStatus
}: EditorPaneProps) => {
  const { showFind, setShowFind, findVal, setFindVal, replaceVal, setReplaceVal, toggleFind, doReplace, doReplaceAll } = findReplace;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Toolbar
        onCmd={onCmd}
        onInsertHTML={onInsertHTML}
        onShowCode={onShowCode}
        onShowTable={onShowTable}
        onShowFind={toggleFind}
        findActive={showFind}
        editorFont={editorFont}
        onFontChange={onFontChange}
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

      <Editor ref={editorRef} onInput={onInput} editorFont={editorFont} />
      <StatusBar wordCount={wordCount} charCount={charCount} saveStatus={saveStatus} />
    </div>
  );
});

export default EditorPane;
