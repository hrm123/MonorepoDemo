import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const Blog = React.lazy(() => import('blog/Module'));

const Profile = React.lazy(() => import('profile/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/blog">Blog</Link>
        </li>

        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="shell" />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
