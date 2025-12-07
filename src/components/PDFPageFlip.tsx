import { useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuration de PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPageFlipProps {
  pdfUrl: string;
  title?: string;
}

export default function PDFPageFlip({ pdfUrl, title = 'Document' }: PDFPageFlipProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const flipBookRef = useRef<any>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const goToPrevPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  }, []);

  const goToNextPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  }, []);

  const zoomIn = () => {
    setScale((prev) => Math.min(1.5, prev + 0.1));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.6, prev - 0.1));
  };

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Barre d'outils supérieure */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Titre */}
          <div className="text-white">
            <h2 className="text-lg md:text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-300">
              Page {currentPage + 1} / {numPages}
            </p>
          </div>

          {/* Contrôles */}
          <div className="flex items-center space-x-2">
            {/* Zoom */}
            <button
              onClick={zoomOut}
              className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={zoomIn}
              className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-colors"
              title="Zoom avant"
            >
              <ZoomIn size={20} />
            </button>

            {/* Télécharger */}
            <a
              href={pdfUrl}
              download
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              title="Télécharger PDF"
            >
              <Download size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Zone du flipbook */}
      <div className="flex items-center justify-center py-8 px-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-screen">
              <div className="text-white text-xl">Chargement du document...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-screen">
              <div className="text-red-500 text-xl">Erreur de chargement du PDF</div>
            </div>
          }
        >
          {numPages > 0 && (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={400}
                height={566}
                size="stretch"
                minWidth={300}
                maxWidth={600}
                minHeight={400}
                maxHeight={800}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="shadow-2xl"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="bg-white shadow-lg">
                    <Page
                      pageNumber={index + 1}
                      width={400}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>
      </div>

      {/* Contrôles de navigation (bas de page) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentPage === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          {/* Indicateur de page */}
          <div className="bg-white/90 px-6 py-3 rounded-lg text-gray-900 font-semibold">
            {currentPage + 1} / {numPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentPage >= numPages - 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600/90 text-white px-6 py-2 rounded-full text-sm backdrop-blur-sm">
        💡 Cliquez sur les coins des pages pour tourner
      </div>
    </div>
  );
}
