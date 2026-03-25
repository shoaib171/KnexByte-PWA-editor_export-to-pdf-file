import { useCallback, RefObject } from 'react';

export function useEditorCommands(editorRef: RefObject<HTMLDivElement | null>) {
  const cmd = useCallback((command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, [editorRef]);

  const insertHTML = useCallback((html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
  }, [editorRef]);

  return { cmd, insertHTML };
}
