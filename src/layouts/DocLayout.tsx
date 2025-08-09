import { NavLink, Outlet } from 'react-router';
import { Button } from '../ui';

export default function DocLayout() {
  return (
    <div>
      <aside className="fixed top-0 left-0 h-dvh w-72 overflow-auto border-e-2">
        <p className="p-4 text-center text-xl font-medium">ATK Documentation</p>
        <nav className="p-4">
          <ul className="flex flex-col">
            <li>
              <NavLink to="/docs">
                <Button variant="secondary" size="sm" className="w-full">
                  Get Started
                </Button>
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/docs/button">
                <Button variant="secondary" size="sm" className="w-full">
                  Button
                </Button>
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/docs/number-line">
                <Button variant="secondary" size="sm" className="w-full">
                  Number Line
                </Button>
              </NavLink>
            </li>
            <li>
              <NavLink to="/docs/cartesian-plane">
                <Button variant="secondary" size="sm" className="w-full">
                  Cartesian Plane
                </Button>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="ml-72">
        <Outlet />
      </main>
    </div>
  );
}
