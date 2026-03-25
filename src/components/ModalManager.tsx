import { memo } from 'react';
import CodeModal from './modals/CodeModal';
import TableModal from './modals/TableModal';
import { useInsertContent } from '../hooks/useInsertContent';

interface ModalManagerProps {
  content: ReturnType<typeof useInsertContent>;
}

const ModalManager = memo(({ content }: ModalManagerProps) => {
  const {
    showCodeModal, setShowCodeModal, codeLang, setCodeLang, codeContent, setCodeContent, insertCodeBlock,
    showTableModal, setShowTableModal, tableRows, setTableRows, tableCols, setTableCols, insertTable,
  } = content;

  return (
    <>
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
    </>
  );
});

export default ModalManager;
