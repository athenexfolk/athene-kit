import CartesianPlane from './CartesianPlane';

function App() {
  return (
    <>
      <div className="p-4" style={{ display: 'grid', gap: 32 }}>
        <div>
          <div>Edge case: mX=0, mY=0 (hide left, bottom arrows)</div>
          <CartesianPlane
            margin={50}
            minX={0}
            minY={0}
            maxX={10}
            maxY={10}
            step={4}
          />
        </div>
        <div>
          <div>Edge case: mX=0, MY=0 (hide left, top arrows)</div>
          <CartesianPlane margin={50} minX={0} minY={-10} maxX={10} maxY={0} />
        </div>
        <div>
          <div>Edge case: MX=0, MY=0 (hide top, right arrows)</div>
          <CartesianPlane margin={50} minX={-10} minY={-10} maxX={0} maxY={0} />
        </div>
        <div>
          <div>Edge case: MX=0, mY=0 (hide bottom, right arrows)</div>
          <CartesianPlane margin={50} minX={-10} minY={0} maxX={0} maxY={10} />
        </div>
      </div>
      <div>
        <div>Case: Only X axis at 0 (minX=0, maxX=10, minY=-10, maxY=10)</div>
        <CartesianPlane margin={50} minX={0} maxX={10} minY={-10} maxY={10} />
      </div>
      <div>
        <div>Case: Only X axis at 0 (minX=-10, maxX=0, minY=-10, maxY=10)</div>
        <CartesianPlane margin={50} minX={-10} maxX={0} minY={-10} maxY={10} />
      </div>
      <div>
        <div>Case: Only Y axis at 0 (minX=-10, maxX=10, minY=0, maxY=10)</div>
        <CartesianPlane margin={50} minX={-10} maxX={10} minY={0} maxY={10} />
      </div>
      <div>
        <div>Case: Only Y axis at 0 (minX=-10, maxX=10, minY=-10, maxY=0)</div>
        <CartesianPlane margin={50} minX={-10} maxX={10} minY={-10} maxY={0} />
      </div>
    </>
  );
}

export default App;
