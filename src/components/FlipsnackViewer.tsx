import { useEffect, useRef } from 'react';

interface FlipsnackViewerProps {
  flipsnackId: string;
  title?: string;
}

export default function FlipsnackViewer({ flipsnackId, title = 'Document' }: FlipsnackViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger le script Flipsnack si pas déjà chargé
    const loadFlipsnackScript = () => {
      if (document.getElementById('flipsnack-script')) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'flipsnack-script';
        script.src = 'https://cdn.flipsnack.com/widget/v2/widget.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Flipsnack script'));
        document.body.appendChild(script);
      });
    };

    loadFlipsnackScript()
      .then(() => {
        console.log('Flipsnack script loaded successfully');
      })
      .catch((error) => {
        console.error('Error loading Flipsnack:', error);
      });
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-screen bg-gray-900">
      {/* Iframe Flipsnack */}
      <iframe
        src={`https://www.flipsnack.com/widget/v2/widget.html?hash=${flipsnackId}`}
        width="100%"
        height="100%"
        seamless
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-read; clipboard-write"
        className="w-full h-screen"
        title={title}
        style={{
          border: 'none',
          minHeight: '600px',
        }}
      />
    </div>
  );
}
