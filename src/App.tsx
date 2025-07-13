import CanvasExportable from './CanvasExportable';
import CartesianPlane from './CartesianPlane';
import NumberLine from './NumberLine';

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
