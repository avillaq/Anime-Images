import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import { Button } from "@nextui-org/button";
import Heart from "react-heart";
import { fetchFavorites, removeFromFavorites, downloadImage } from "../service/apiService";
import "../styles/Favorites.css";

export const Favorites = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFavorite = async (imageUrl) => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      const result = await removeFromFavorites(imageUrl);
      if (!result.error) {
        setImages(prev => prev.filter(img => img.src !== imageUrl));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDownload = async (imageUrl) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await downloadImage(imageUrl);
      const filename = imageUrl.split("/").pop() || "anime-image.jpg";
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites();
        if (data.error) {
          setError(data.error);
          return;
        }

        const formattedImages = data.favorites.map(favorite => ({
          src: favorite.image_url,
          width: favorite.width,
          height: favorite.height,
          customOverlay: (
            <div className="custom-overlay__caption">
              <div className="image-overlay">
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  className="overlay-button"
                >
                  <Heart
                    isActive={true}
                    animationScale={1.2}
                    inactiveColor="white"
                    activeColor="red"
                    onClick={() => handleRemoveFavorite(favorite.image_url)}
                  />
                </Button>
                <Button
                  isIconOnly
                  color="secondary"
                  variant="light"
                  className="overlay-button"
                  onPress={() => handleDownload(favorite.image_url)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px">
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#f1f1f1" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" />
                  </svg>
                </Button>
              </div>
            </div>
          )
        }));

        setImages(formattedImages);
      } catch (err) {
        console.error(err);
        setError("Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="favorites-container">
      <div className="favorites-header-container">
        <h1>All your favorite images ({images.length})</h1>
      </div>
      <div className="favorites-content-container">
        <Gallery
          images={images}
          enableImageSelection={false}
          rowHeight={280}
          margin={4}
        />
      </div>
    </section>
  );
};