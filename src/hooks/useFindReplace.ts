import { useState, useRef, useCallback, RefObject } from 'react';

export function useFindReplace(editorRef: RefObject<HTMLDivElement | null>) {
  const [showFind, setShowFind] = useState(false);
  const [findVal, setFindVal] = useState("");
  const [replaceVal, setReplaceVal] = useState("");

  // Latest-value refs so doReplace/doReplaceAll stay stable
  const findValRef = useRef(findVal);
  findValRef.current = findVal;
  const replaceValRef = useRef(replaceVal);
  replaceValRef.current = replaceVal;

  const toggleFind = useCallback(() => setShowFind(f => !f), []);

  const escape = (val: string) => val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const doReplace = useCallback(() => {
    if (!findValRef.current || !editorRef.current) return;
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
      new RegExp(escape(findValRef.current), "i"), replaceValRef.current
    );
  }, [editorRef]);

  const doReplaceAll = useCallback(() => {
    if (!findValRef.current || !editorRef.current) return;
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
      new RegExp(escape(findValRef.current), "gi"), replaceValRef.current
    );
  }, [editorRef]);

  return { showFind, setShowFind, findVal, setFindVal, replaceVal, setReplaceVal, toggleFind, doReplace, doReplaceAll };
}
