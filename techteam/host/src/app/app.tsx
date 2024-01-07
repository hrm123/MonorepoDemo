import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const Collobrate = React.lazy(() => import('collobrate/Module'));

const Register = React.lazy(() => import('register/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/collobrate">Collobrate</Link>
        </li>

        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="host" />} />

        <Route path="/collobrate" element={<Collobrate />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
