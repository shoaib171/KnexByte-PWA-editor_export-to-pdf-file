import { useCallback, RefObject } from 'react';
import { Note } from '../types';

export function usePDF(
  editorRef: RefObject<HTMLDivElement | null>,
  notes: Note[],
  currentId: string | null
) {
  const downloadAsPDF = useCallback(() => {
    const content = editorRef.current?.innerHTML || "";
    const title = notes.find(n => n.id === currentId)?.title || "note";
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>
  @media print { @page { margin: 20mm 18mm; size: A4; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  * { box-sizing: border-box; }
  body { background: #fff; color: #1a1a2e; font-family: Calibri, 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.8; margin: 0; padding: 24px 32px; }
  h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.2em; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12.5px; }
  th, td { padding: 8px 12px; border: 1px solid #d0d7de; }
  th { background: #f6f8fa; color: #0969da; font-size: 10.5px; text-transform: uppercase; font-weight: 700; }
  blockquote { border-left: 3px solid #0969da; padding: 6px 14px; color: #57606a; font-style: italic; background: #f6f8fa; margin: 12px 0; }
  .kb-code-block { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; margin: 14px 0; }
  pre { margin: 0; padding: 14px; background: #f6f8fa; overflow-x: auto; }
  code { font-family: 'Courier New', monospace; font-size: 12px; color: #1a1a2e; }
  hr { border: none; border-top: 1px solid #d0d7de; margin: 16px 0; }
  .kb-logo { margin-bottom: 20px; border-bottom: 1px solid #d0d7de; padding-bottom: 12px; }
  .kb-logo .knex { font-weight: 800; font-size: 18px; color: transparent; -webkit-text-stroke: 1px #1a1a2e; }
  .kb-logo .byte { font-weight: 800; font-size: 18px; color: #0969da; }
  .kb-logo .sys { font-size: 8px; color: #57606a; letter-spacing: 2px; margin-left: 2px; }
</style></head><body>
<div class="kb-logo">
  <span class="knex">KNEX</span><span class="byte">BYTE</span><span class="sys">systems</span>
</div>
${content}
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (!printWindow) { URL.revokeObjectURL(url); return; }
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => { printWindow.close(); URL.revokeObjectURL(url); };
    };
  }, [editorRef, notes, currentId]);

  return { downloadAsPDF };
}
