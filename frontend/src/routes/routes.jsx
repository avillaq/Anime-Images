import { Home } from '../pages/Home';
import { ImageViewer } from '../pages/ImageViewer';
import { NotFound } from '../pages/NotFound';

export const SFWViewer = () => (<ImageViewer type={"sfw"}/>)
export const NSFWViewer = () => (<ImageViewer type={"nsfw"}/>)

export const routes = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '/image/sfw',
    element: SFWViewer,
  },
  {
    path: '/image/nsfw',
    element: NSFWViewer,
  },
  {
    path: '*',
    element: NotFound,
  },
];