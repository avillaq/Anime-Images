import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './Routes';
import { Layout } from '../components/Layout';

export const RouterProvider = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {routes.map(({ path, element: Element }) => (
              <Route
                key={path}
                path={path}
                element={<Element />}
              />
            ))}
          </Route>
        </Routes>
    </BrowserRouter>
  );
};