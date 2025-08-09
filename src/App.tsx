import { Route, Routes } from 'react-router';
import DocLayout from './layouts/DocLayout';
import HomePage from './pages/HomePage';
import ButtonPage from './pages/ButtonPage';
import DocHomePage from './pages/DocHomePage';
import NumberLinePage from './pages/NumberLinePage';
import CartesianPlanePage from './pages/CartesianPlanePage';

export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="docs">
        <Route element={<DocLayout />}>
          <Route index element={<DocHomePage />} />
          <Route path="button" element={<ButtonPage />} />
          <Route path="number-line" element={<NumberLinePage />} />
          <Route path="cartesian-plane" element={<CartesianPlanePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
