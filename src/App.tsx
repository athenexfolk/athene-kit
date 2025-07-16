import CanvasExportable from './canvas/CanvasExportable';
import CartesianPlane from './canvas/CartesianPlane';
import NumberLine from './canvas/NumberLine';

function App() {
  return (
    <>
      <CanvasExportable
        filename="my-number-line.webp"
        buttonLabel="Download as WebP"
      >
        {(canvasRef) => <NumberLine ref={canvasRef} />}
      </CanvasExportable>
      <CanvasExportable filename="my-plot.webp" buttonLabel="Download as WebP">
        {(canvasRef) => <CartesianPlane ref={canvasRef} />}
      </CanvasExportable>
    </>
  );
}

export default App;
