import { BrowserRouter, Routes, Route, useNavigate, useHref } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/system";
import { routes } from './Routes';
import { Layout } from '../components/Layout';


const NextUIRouteProvider = () => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
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
    </NextUIProvider>
  )
}

export const RouterProvider = () => {

  return (
    <BrowserRouter>
      <NextUIRouteProvider/>
    </BrowserRouter>
  );
};