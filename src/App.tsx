// import ConstructionTool from './canvas/ConstructionTool';
// import CartesianPlaneExample from './example/CartesianPlaneExample';
// import InfiniteCartesianPlaneExample from './example/InfiniteCartesianPlaneExample';
// import NumberLineExample from './example/NumberLineExample';

import ConstructionTool from './tools/ConstructionTool/ConstructionTool';

export default function App() {
  return (
    <div className="App">
      {/* <h1>Welcome to My App</h1>
      <p>This is a simple React application.</p> */}
      <div className="mx-auto max-w-4xl">
        <ConstructionTool width={768} height={600} />
      </div>
      {/* <ConstructionTool />
      <NumberLineExample />
      <CartesianPlaneExample />
      <InfiniteCartesianPlaneExample /> */}
    </div>
  );
}
