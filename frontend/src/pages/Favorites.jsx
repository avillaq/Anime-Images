import { useEffect } from "react";
import { fetchFavorites } from "../service/apiService";

import "../styles/Favorites.css";
export const Favorites = () => {
  useEffect(() => {
    fetchFavorites().then((data) => {
      console.log(data);
    });
  }, []);
  
  return (
    <section className="favorites-container">
      <div className="favorites-header-container">
        <h1>All your favorite images</h1>
      </div>
      <div className="favorites-content-container">
        {
          /*
            Here you can map over the favorite images and display them in a grid.
          */
        }
      </div>
    </section>
  )
}
