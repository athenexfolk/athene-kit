import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type RefObject,
} from 'react';
import { Button } from '../ui';

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
    <div className="flex flex-col items-center gap-4 overflow-auto rounded border-2 p-4">
      <Button onClick={handleExport} disabled={!canvasAvailable}>
        {buttonLabel}
      </Button>
      <div className="mx-auto rounded border-2">{children(canvasRef)}</div>
    </div>
  );
}

export default CanvasExportable;
