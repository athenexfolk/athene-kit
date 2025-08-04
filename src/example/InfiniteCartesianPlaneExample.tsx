import InfiniteCartesianPlane from '../canvas/InfiniteCartesianPlane';

export default function InfiniteCartesianPlaneExample() {
  return (
    <div>
      <h2>Infinite Cartesian Plane Example</h2>
      <p>This is an example of an infinite Cartesian plane.</p>
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
    </div>
  );
}
