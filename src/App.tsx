import CanvasExportable from './canvas/CanvasExportable';
import CartesianPlane from './canvas/CartesianPlane';
import NumberLine from './canvas/NumberLine';

function App() {
  // Circle: center (2, -2), radius 5
  const circlePoints = Array.from({ length: 200 }, (_, i) => {
    const theta = (2 * Math.PI * i) / 200;
    return { x: 2 + 5 * Math.cos(theta), y: -2 + 5 * Math.sin(theta) };
  });

  // Ellipse: center (-3, 3), a=6, b=2
  const ellipsePoints = Array.from({ length: 200 }, (_, i) => {
    const theta = (2 * Math.PI * i) / 200;
    return { x: -3 + 6 * Math.cos(theta), y: 3 + 2 * Math.sin(theta) };
  });

  // Parabola: y = 0.2 * (x - 4)^2 - 5, x in [-6, 14]
  const parabolaPoints = Array.from({ length: 200 }, (_, i) => {
    const x = -6 + (20 * i) / 199;
    const y = 0.2 * Math.pow(x - 4, 2) - 5;
    return { x, y };
  });

  // Hyperbola: (x/4)^2 - (y/2)^2 = 1, x in [-10, -4] U [4, 10]
  const hyperbolaPoints1 = Array.from({ length: 100 }, (_, i) => {
    const x = -10 + (6 * i) / 99;
    const y = 2 * Math.sqrt(Math.pow(x / 4, 2) - 1);
    return { x, y };
  });
  const hyperbolaPoints2 = Array.from({ length: 100 }, (_, i) => {
    const x = -10 + (6 * i) / 99;
    const y = -2 * Math.sqrt(Math.pow(x / 4, 2) - 1);
    return { x, y };
  });
  const hyperbolaPoints3 = Array.from({ length: 100 }, (_, i) => {
    const x = 4 + (6 * i) / 99;
    const y = 2 * Math.sqrt(Math.pow(x / 4, 2) - 1);
    return { x, y };
  });
  const hyperbolaPoints4 = Array.from({ length: 100 }, (_, i) => {
    const x = 4 + (6 * i) / 99;
    const y = -2 * Math.sqrt(Math.pow(x / 4, 2) - 1);
    return { x, y };
  });

  return (
    <>
      <CanvasExportable
        filename="my-number-line.webp"
        buttonLabel="Download as WebP"
      >
        {(canvasRef) => <NumberLine ref={canvasRef} />}
      </CanvasExportable>
      <CanvasExportable filename="my-plot.webp" buttonLabel="Download as WebP">
        {(canvasRef) => (
          <CartesianPlane
            ref={canvasRef}
            lines={[
              // Sine function
              {
                fn: (x) => Math.sin(x),
                domain: [-10, 10],
                color: 'magenta',
                width: 2,
                dash: [4, 2],
              },
              // Exponential function
              {
                fn: (x) => Math.exp(x / 5),
                domain: [-10, 10],
                color: 'teal',
                width: 2,
              },
              // Reciprocal function
              {
                fn: (x) => 1 / x,
                domain: [-10, 10],
                color: 'orange',
                width: 2,
                dash: [2, 6],
              },
              // Tangent function
              {
                fn: (x) => Math.tan(x / 2),
                domain: [-10, 10],
                color: 'blue',
                width: 2,
                dash: [8, 4],
              },
              // Circle
              {
                points: circlePoints,
                color: 'green',
                width: 2,
              },
              // Ellipse
              {
                points: ellipsePoints,
                color: 'purple',
                width: 2,
              },
              // Parabola
              {
                points: parabolaPoints,
                color: 'red',
                width: 2,
              },
              // Hyperbola (4 branches)
              {
                points: hyperbolaPoints1,
                color: 'brown',
                width: 2,
              },
              {
                points: hyperbolaPoints2,
                color: 'brown',
                width: 2,
              },
              {
                points: hyperbolaPoints3,
                color: 'brown',
                width: 2,
              },
              {
                points: hyperbolaPoints4,
                color: 'brown',
                width: 2,
              },
            ]}
          />
        )}
      </CanvasExportable>
    </>
  );
}

export default App;
