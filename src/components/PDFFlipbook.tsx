import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Menu } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFFlipbook.css';

// Configuration de PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFFlipbookProps {
  pdfUrl: string;
  tableOfContents: Array<{ title: string; page: number }>;
}

export default function PDFFlipbook({ pdfUrl, tableOfContents }: PDFFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTOC, setShowTOC] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Ajuster le scale pour mobile
      if (window.innerWidth < 768) {
        setScale(0.5);
      } else {
        setScale(1.0);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(2.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goToPage = (page: number) => {
    setPageNumber(page);
    setShowTOC(false);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Barre d'outils supérieure */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Bouton Table des matières */}
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Menu size={20} />
            <span className="hidden sm:inline">Sommaire</span>
          </button>

          {/* Indicateur de page */}
          <div className="bg-white/90 px-4 py-2 rounded-lg text-gray-900 font-semibold">
            Page {pageNumber} / {numPages}
          </div>

          {/* Contrôles de zoom et plein écran */}
          <div className="flex items-center space-x-2">
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
            <button
              onClick={toggleFullscreen}
              className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg transition-colors"
              title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Table des matières (sidebar) */}
      {showTOC && (
        <div className="absolute top-0 left-0 bottom-0 z-30 w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-900">Sommaire</h3>
              <button
                onClick={() => setShowTOC(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-2">
              {tableOfContents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(item.page)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    pageNumber === item.page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm opacity-75">Page {item.page}</div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Zone de visualisation du PDF */}
      <div className="absolute inset-0 flex items-center justify-center overflow-auto pt-20 pb-20">
        <div className="pdf-container" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
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
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-2xl"
              width={isMobile ? 300 : 600}
            />
          </Document>
        </div>
      </div>

      {/* Contrôles de navigation (bas de page) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              pageNumber <= 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          {/* Input de navigation directe */}
          <div className="flex items-center space-x-2 bg-white/90 px-4 py-2 rounded-lg">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setPageNumber(page);
                }
              }}
              className="w-16 text-center border-none outline-none bg-transparent text-gray-900 font-semibold"
            />
            <span className="text-gray-600">/ {numPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              pageNumber >= numPages
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Navigation au clavier */}
      <div className="hidden">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') goToPrevPage();
            if (e.key === 'ArrowRight') goToNextPage();
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
