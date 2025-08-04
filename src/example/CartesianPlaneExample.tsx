import CanvasExportable from '../canvas/CanvasExportable';
import CartesianPlane from '../canvas/CartesianPlane';

export default function CartesianPlaneExample() {
  return (
    <div>
      <h2>Cartesian Plane Example</h2>
      <p>This is an example of a Cartesian plane.</p>
      <CartesianPlane />
      <CartesianPlane minX={0} minY={0} maxX={20} maxY={20} />
      <CartesianPlane
        points={[
          { x: 0, y: 0, label: 'Origin' },
          { x: 1, y: 1, label: 'Point 1' },
        ]}
      />
      <CartesianPlane
        lines={[{ fn: (x) => x, domain: [-10, 10], color: 'red' }]}
      />
      <CartesianPlane
        onDraw={(ctx) => {
          ctx.beginPath();
          ctx.moveTo(50, 50);
          ctx.lineTo(100, 100);
          ctx.lineTo(150, 50);
          ctx.stroke();
        }}
      />
      <CanvasExportable filename="my-plot.webp" buttonLabel="Download as WebP">
        {(canvasRef) => <CartesianPlane ref={canvasRef} />}
      </CanvasExportable>
    </div>
  );
}
