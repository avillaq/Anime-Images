import { Home } from '../pages/Home';
import { ImageViewer } from '../pages/ImageViewer';
import { Favorites } from '../pages/Favorites';
import { NotFound } from '../pages/NotFound';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export const SFWViewer = () => (<ImageViewer type={"sfw"}/>)
export const NSFWViewer = () => (<ImageViewer type={"nsfw"}/>)
export const UserFavorites = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/"/>
  }
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