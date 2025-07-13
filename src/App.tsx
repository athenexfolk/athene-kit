import CanvasExportable from './CanvasExportable';
import CartesianPlane from './CartesianPlane';

function App() {
  return (
    <>
      <CanvasExportable filename="my-plot.webp" buttonLabel="Download as WebP">
        {(canvasRef) => <CartesianPlane ref={canvasRef} />}
      </CanvasExportable>
    </>
  );
}

export default App;
