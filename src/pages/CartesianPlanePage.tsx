import CanvasExportable from '../canvas/CanvasExportable';
import CartesianPlane from '../canvas/CartesianPlane';
import InfiniteCartesianPlane from '../canvas/InfiniteCartesianPlane';

export default function CartesianPlanePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Cartesian Plane</h1>
      <p className="mt-4">
        The cartesian plane is a two-dimensional coordinate system defined by a
        horizontal axis (x) and a vertical axis (y).
      </p>
      <div className="flex flex-col gap-4">
        <CartesianPlane />
        <CartesianPlane minX={-5} maxX={5} minY={-5} maxY={5} />
        <InfiniteCartesianPlane
          initialMinX={-20}
          initialMaxX={20}
          initialMinY={-20}
          initialMaxY={20}
          points={[
            { x: 0, y: 0, label: 'Origin' },
            { x: 5, y: 5, label: 'Point A' },
          ]}
          lines={[{ fn: (x) => x * x, domain: [-10, 10], color: 'blue' }]}
        />
        <CanvasExportable
          filename="my-plot.webp"
          buttonLabel="Download as WebP"
        >
          {(canvasRef) => <CartesianPlane ref={canvasRef} />}
        </CanvasExportable>
      </div>
    </div>
  );
}
