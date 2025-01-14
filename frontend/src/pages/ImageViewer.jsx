import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/style.css";
import { fetchTags, fetchRandomImage, downloadImage, addToFavorites, removeFromFavorites } from "../service/apiService";
import { useAuthStore } from "../store/authStore";
import Heart from "react-heart";
import AnimePlaceholder from "../assets/anime-placeholder.webp";
import "../styles/ImageViewer.css";

export const ImageViewer = ({ type }) => {
  const [category, SetCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const [isImageLoad, setIsImageLoad] = useState(true);
  const { isAuthenticated, hasFavorite, addFavorite, removeFavorite } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const [heartActive, setHeartActive] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      const result = await fetchTags();
      if (result.error) {
        toast(result.error, { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
        return;
      }
      const formattedTags = result[type].map((tag) => ({
        key: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      }));
      setTags(formattedTags);
    }

    getTags();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setHeartActive(false);
      return;
    }
    if (image) {
      setHeartActive(hasFavorite(image));
    }
  }, [isAuthenticated, image]);

  const fetchImage = async () => {
    setHeartActive(false);
    setIsImageLoad(false);
    const result = await fetchRandomImage(type, category);
    if (result.error) {
      toast(result.error, { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
      return;
    }
    setImage(result.image_url);
  };

  const toggleFavorites = async () => {
    if (!isAuthenticated) {
      toast("Please login to add favorites", { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
      return;
    }

    const isCurrentlyFavorite = hasFavorite(image);

    if (isCurrentlyFavorite) {
      removeFavorite(image);
      setHeartActive(false);
    } else {
      addFavorite(image);
      setHeartActive(true);
    }

    let result;
    if (isCurrentlyFavorite) {
      result = await removeFromFavorites(image);
    } else {
      result = await addToFavorites(image);
    }

    if (result.error) {
      if (isCurrentlyFavorite) {
        addFavorite(image);
        setHeartActive(true);
      } else {
        removeFavorite(image);
        setHeartActive(false);
      }
      if (result.error === "ExpiredAccessError") {
        toast("Session expired. Please login again.", { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
      } else {
        toast(result.error, { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
      }
    }
  };

  const onDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await downloadImage(image);
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/[""]/g, "")
        : image.split("/").pop() || "anime-image.jpg";

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast("Failed to download image.", { className: "error-toast", position: "bottom-right", maxVisibleToasts: 3, clickClosable: true, duration: 2000 }); 
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="image-viewer-container">
      <div className="image-viewer-content-container">
        <h1>Random {type.toUpperCase()} Anime Image</h1>
        <div className="image-viewer-select-container">
          <Select
            variant="bordered"
            color={type === "sfw" ? "secondary" : "danger"}
            className="max-w-xs"
            label="Select a category"
            onChange={(e) => SetCategory(e.target.value)}
            items={tags}
          >
            {(t) => <SelectItem>{t.label}</SelectItem>}
          </Select>
          <Button className="min-w-8" isDisabled={!category} onPress={fetchImage} color={type === "sfw" ? "secondary" : "danger"}>
            Get Image
          </Button>
        </div>
      </div>
      <div className="image-viewer-image-container">
        <figure>
          <Image
            alt="Anime Image Placeholder"
            src={image || AnimePlaceholder}
            draggable={false}
            onLoad={() => setIsImageLoad(true)}
          />
        </figure>
        <div className="image-viewer-action-container">
          <Button color="danger" variant="bordered" isDisabled={!image || !isImageLoad}>
            <Heart
              isActive={heartActive}
              onClick={() => toggleFavorites()}
              animationScale={1.30}
              inactiveColor="white"
              activeColor="red"
            />
          </Button>
          <Button color="secondary" variant="ghost" className="text-inherit" isDisabled={!image || isDownloading || !isImageLoad} onPress={onDownload}>
            {
              isDownloading ?
                <Spinner size="sm" color="default"/>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#f1f1f1" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path> </g> </g></svg>
            }

          </Button>
        </div>

      </div>

    </section>
  )
}
