import { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import Heart from "react-heart";
import { fetchFavorites, removeFromFavorites, downloadImage } from "../service/apiService";
import "../styles/Favorites.css";

export const Favorites = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(-1);

  const viewImage = (index, item) => {
    setIndex(index);
  }

  const removeImage = async (imageUrl) => {
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

  const onDownload = async (imageUrl) => {
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
          original: favorite.image_url,
          width: favorite.width,
          height: favorite.height,
          customOverlay: (
            <div className="custom-overlay__caption">
              <Tooltip
                content=
                {<div className="image-overlay">
                  <Button color="danger" variant="bordered" size="sm" isDisabled={isRemoving}>
                    <Heart
                      isActive={true}
                      onClick={() => removeImage(favorite.image_url)}
                      animationScale={1.1}
                      inactiveColor="white"
                      activeColor="red"
                    />
                  </Button>
                  <Button color="secondary" variant="ghost" size="sm" className="text-inherit" isDisabled={isDownloading || isRemoving} onPress={() => onDownload(favorite.image_url)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#f1f1f1" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path> </g> </g></svg>
                  </Button>
                </div>}
                color="foreground"
                placement="bottom"
                closeDelay={250}
                offset={5}
              >
                <Button
                  color="foreground"
                  className="text-black"
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                    <circle cx="5" cy="12" r="2" />
                  </svg>
                </Button>
              </Tooltip>
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

  useEffect(() => {
    if (index > -1) {
      setSlides(images.map(image => ({
        src: image.src,
        width: image.width,
        height: image.height
      })));
    }
  }, [images]);


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
          onClick={viewImage}
        />
        <Lightbox
          slides={slides}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
        />
      </div>
    </section>
  );
};