import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';

export const routes = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '*',
    element: NotFound,
  },
];