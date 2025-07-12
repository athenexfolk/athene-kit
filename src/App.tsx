import CartesianPlane from './CartesianPlane';

function App() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      {/* Numbered axes (Quadrant IV: x > 0, y < 0) */}
      <div>
        <h4>Quadrant IV</h4>
        <CartesianPlane minX={0} maxX={10} minY={-10} maxY={0} step={1} />
      </div>
      {/* Default Cartesian Plane */}
      <div>
        <h4>Default</h4>
        <CartesianPlane />
      </div>

      {/* Custom bounds, positive only */}
      <div>
        <h4>Positive Only</h4>
        <CartesianPlane minX={0} maxX={10} minY={0} maxY={10} />
      </div>

      {/* Custom bounds, negative only */}
      <div>
        <h4>Negative Only</h4>
        <CartesianPlane minX={-10} maxX={-1} minY={-10} maxY={-1} />
      </div>

      {/* Decimal step */}
      <div>
        <h4>Decimal Step</h4>
        <CartesianPlane minX={-2} maxX={2} minY={-2} maxY={2} step={0.2} />
      </div>

      {/* Large range */}
      <div>
        <h4>Large Range</h4>
        <CartesianPlane
          minX={-100}
          maxX={100}
          minY={-100}
          maxY={100}
          step={20}
        />
      </div>

      {/* No grid */}
      <div>
        <h4>No Grid</h4>
        <CartesianPlane showGrid={false} />
      </div>

      {/* Custom grid color and width */}
      <div>
        <h4>Custom Grid Style</h4>
        <CartesianPlane
          gridColor="#f00"
          gridWidth={2}
          axisColor="#00f"
          axisWidth={3}
        />
      </div>

      {/* Logging enabled */}
      <div>
        <h4>Logging</h4>
        <CartesianPlane
          logging
          step={2.5}
          minX={-5}
          maxX={5}
          minY={-5}
          maxY={5}
        />
      </div>

      {/* Numbered axes (centered origin) */}
      <div>
        <h4>Numbered Axes (Origin Center)</h4>
        <CartesianPlane minX={-5} maxX={5} minY={-5} maxY={5} step={1} />
      </div>

      {/* Numbered axes (origin not at center, positive quadrant) */}
      <div>
        <h4>Numbered Axes (Origin Bottom Left)</h4>
        <CartesianPlane minX={0} maxX={10} minY={0} maxY={10} step={1} />
      </div>

      {/* Numbered axes (origin not at center, negative quadrant) */}
      <div>
        <h4>Numbered Axes (Origin Top Right)</h4>
        <CartesianPlane minX={-10} maxX={0} minY={-10} maxY={0} step={1} />
      </div>

      {/* Numbered axes (origin offset, not on edge or center) */}
      <div>
        <h4>Numbered Axes (Origin Offset)</h4>
        <CartesianPlane minX={2} maxX={12} minY={-3} maxY={7} step={1} />
      </div>
    </div>
  );
}

export default App;
