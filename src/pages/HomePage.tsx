import { NavLink } from 'react-router';
import { Button } from '../ui';
import ButtonExamples from '../ui/examples/button.example';

export default function HomePage() {
  return (
    <>
      <div className="flex h-dvh items-center justify-center p-8">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl">Welcome to Athene Kit</h1>
          <p className="text-center text-lg">
            A modern UI kit for building beautiful web apps with React.
          </p>
          <div className="flex gap-8">
            <NavLink to="docs">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </NavLink>
            <NavLink to="docs">
              <Button variant="secondary" size="lg">
                Docs
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="min-h-dvh">
        <ButtonExamples />
      </div>
    </>
  );
}
