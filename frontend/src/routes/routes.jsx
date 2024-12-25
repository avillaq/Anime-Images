import { Home } from '../pages/Home';
import { ImageViewer } from '../pages/ImageViewer';
import { NotFound } from '../pages/NotFound';

const SFWViewer = () => {
  return (<ImageViewer type={"sfw"}/>)
}

const NSFWViewer = () => {
  return (<ImageViewer type={"nsfw"}/>)
}

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