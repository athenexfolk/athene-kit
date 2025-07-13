import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type RefObject,
} from 'react';

interface CanvasExportableProps {
  children: (canvasRef: RefObject<HTMLCanvasElement | null>) => ReactNode;
  filename?: string;
  buttonLabel?: string;
}

function CanvasExportable({
  children,
  filename = 'export.webp',
  buttonLabel = 'Export as WebP',
}: CanvasExportableProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasAvailable, setCanvasAvailable] = useState(false);

  useEffect(() => {
    setCanvasAvailable(!!canvasRef.current);
  }, [canvasRef]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/webp');
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      {children(canvasRef)}
      <button
        onClick={handleExport}
        className="mx-auto rounded bg-stone-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:brightness-90"
        disabled={!canvasAvailable}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default CanvasExportable;
