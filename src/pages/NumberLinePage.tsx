import CanvasExportable from '../canvas/CanvasExportable';
import NumberLine from '../canvas/NumberLine';

export default function NumberLinePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Number Line</h1>
      <p className="mt-4">
        The number line is a visual representation of numbers on a straight
        line.
      </p>
      <div className="flex flex-col gap-4">
        <NumberLine />
        <NumberLine min={0} max={5} />
        <CanvasExportable
          filename="my-plot.webp"
          buttonLabel="Download as WebP"
        >
          {(canvasRef) => <NumberLine ref={canvasRef} />}
        </CanvasExportable>
      </div>
    </div>
  );
}
