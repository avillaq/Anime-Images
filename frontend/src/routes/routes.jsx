import { Home } from '../pages/Home';
import { ImageViewer } from '../pages/ImageViewer';
import { Favorites } from '../pages/Favorites';
import { NotFound } from '../pages/NotFound';

export const SFWViewer = () => (<ImageViewer type={"sfw"}/>)
export const NSFWViewer = () => (<ImageViewer type={"nsfw"}/>)
export const UserFavorites = () => {
  /* Incomplete logic to validate an user */

  return (<Favorites/>)
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
    path: '/user/favorites',
    element: UserFavorites,
  },
  {
    path: '*',
    element: NotFound,
  },
];