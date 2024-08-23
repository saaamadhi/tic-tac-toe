import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import App from './App.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*',
    element: <Navigate to='/' replace={true} />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
