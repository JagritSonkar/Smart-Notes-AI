import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfPreview({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Preview</h3>
        <a href={url} target="_blank" rel="noreferrer" className="btn-ghost text-sm flex items-center gap-1">
          <FiMaximize2 /> Open
        </a>
      </div>
      <div className="flex justify-center bg-gray-100 dark:bg-dark-bg rounded-xl p-4 overflow-auto">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="skeleton h-96 w-72" />}
          error={<p className="text-sm text-gray-500 p-6">Could not load preview. Please download the file.</p>}
        >
          <Page pageNumber={pageNumber} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
      {numPages && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>
          <span className="text-sm">Page {pageNumber} of {numPages}</span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
